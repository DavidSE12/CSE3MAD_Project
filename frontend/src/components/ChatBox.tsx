import React, { useState, useRef, useCallback } from 'react'; // React core + hooks for state, refs, and memoized callbacks
import {
  View,          // generic box container
  Text,          // plain text renderer
  TextInput,     // single/multi-line text field
  Pressable,     // touchable element with pressed-state feedback
  FlatList,      // virtualized scrollable list — only renders visible items
  StyleSheet,    // creates optimised style objects
  ActivityIndicator, // spinning loading indicator
  Image,         // renders raster images (png, jpg, etc.)
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // icon set from Expo
import Markdown from '@ronradtke/react-native-markdown-display'; // Expo-compatible markdown renderer

// Base URL of the FastAPI backend — change to your LAN IP when testing on a physical device
const BACKEND_URL = 'http://192.168.1.118:8000';

type Role = 'user' | 'assistant'; // message sender: either the student or the AI

// Shape of a single chat message stored in state
interface Message {
  id: string;   // unique key used by FlatList
  role: Role;   // who sent the message
  text: string; // message content
}

// Props accepted by the ChatBox component
interface ChatBoxProps {
  height?: number; // optional fixed height; omit to let the component fill available space
}

export default function ChatBox({ height }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]); // ordered array of all chat messages
  const [input, setInput] = useState('');                   // current text in the input field
  const [loading, setLoading] = useState(false);            // true while waiting for a backend response
  const listRef = useRef<FlatList<Message>>(null);          // ref used to scroll the list to the bottom

  // Sends the typed question to the backend and appends the reply to the message list
  const sendMessage = useCallback(async () => {
    const question = input.trim(); // remove leading/trailing whitespace
    if (!question || loading) return; // do nothing if the input is empty or a request is in progress

    // Build the user's message object and append it immediately so the UI feels responsive
    const userMsg: Message = {
      id: Date.now().toString(), // timestamp as a simple unique ID
      role: 'user',
      text: question,
    };

    setMessages((prev) => [...prev, userMsg]); // add user message to list
    setInput('');     // clear the input field
    setLoading(true); // show the typing indicator

    try {
      // POST the question to the /chat endpoint
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }), // payload expected by the FastAPI ChatRequest model
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`); // surface HTTP errors

      const data = await res.json(); // parse the JSON body

      // Build the assistant's reply message
      const botMsg: Message = {
        id: (Date.now() + 1).toString(), // +1 ensures a different ID from the user message
        role: 'assistant',
        text: data.answer ?? 'No answer returned.', // fall back if the backend omits the field
      };

      setMessages((prev) => [...prev, botMsg]); // append AI reply to list
    } catch (err: any) {
      // On any network or server error, show a friendly error bubble
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `Sorry, something went wrong.\n(${err.message})`,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false); // always hide the typing indicator when done
    }
  }, [input, loading]); // recreate only when input or loading changes

  // Renders a single message bubble — memoised to avoid unnecessary re-renders
  const renderItem = useCallback(({ item }: { item: Message }) => {
    const isUser = item.role === 'user'; // true → right-aligned blue bubble; false → left-aligned white bubble
    return (
      <View style={[s.bubble, isUser ? s.userBubble : s.botBubble]}>
        {/* Show the AI avatar circle only on bot messages */}
        {!isUser && (
          <View style={s.botAvatar}>
            <Text style={s.botAvatarText}>AI</Text>
          </View>
        )}
        <View style={[s.bubbleInner, isUser ? s.userInner : s.botInner]}>
          {isUser ? (
            // User messages are plain text — no markdown needed
            <Text style={[s.bubbleText, s.userText]}>{item.text}</Text>
          ) : (
            // Bot messages may contain markdown (bold, lists, code blocks, etc.)
            <Markdown style={markdownStyles}>{item.text}</Markdown>
          )}
        </View>
      </View>
    );
  }, []); // no dependencies — renderItem never changes after mount

  return (
    // Use fixed height when provided, otherwise stretch to fill the parent
    <View style={[s.container, height != null ? { height, flex: 0 } : { flex: 1 }]}>
      {messages.length === 0 ? (
        // Empty state — shown before the first message is sent
        <View style={s.emptyState}>
          <Image
            source={require('../../assets/images/robot.png')} // robot illustration
            style={s.emptyEmoji}
          />
          <Text style={s.emptyTitle}>Ask me anything!</Text>
          <Text style={s.emptyHint}>
            I can explain STEM concepts, activity instructions, and more.
          </Text>
        </View>
      ) : (
        // Scrollable message list — auto-scrolls to bottom when new content arrives
        <FlatList
          ref={listRef}
          data={messages}                    // array of Message objects
          keyExtractor={(item) => item.id}   // unique key per item
          renderItem={renderItem}            // bubble renderer defined above
          contentContainerStyle={s.list}    // inner padding
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })} // scroll on new message
        />
      )}

      {/* Typing indicator — visible while the backend request is in-flight */}
      {loading && (
        <View style={s.typingRow}>
          <View style={s.botAvatar}>
            <Text style={s.botAvatarText}>AI</Text>
          </View>
          <View style={s.typingBubble}>
            <ActivityIndicator size="small" color="#3977fd" /> {/* blue spinner */}
          </View>
        </View>
      )}

      {/* Input bar pinned to the bottom of the component */}
      <View style={s.inputRow}>
        <TextInput
          style={s.textInput}
          value={input}
          onChangeText={setInput}            // update state on every keystroke
          placeholder="Ask a question..."
          placeholderTextColor="#9CA3AF"
          multiline                          // allow line breaks for longer questions
          maxLength={500}                    // cap input length
          onSubmitEditing={sendMessage}      // send on Return key
          blurOnSubmit={false}               // keep keyboard open after submit
        />
        <Pressable
          style={({ pressed }) => [
            s.sendBtn,
            (!input.trim() || loading) && s.sendBtnDisabled, // grey out when nothing to send
            pressed && s.sendBtnPressed,                      // darken on press
          ]}
          onPress={sendMessage}
          disabled={!input.trim() || loading} // prevent double-sends
        >
          <MaterialCommunityIcons name="send" size={20} color="#fff" /> {/* send icon */}
        </Pressable>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    backgroundColor: '#F8F4EF', // warm off-white background
    borderRadius: 16,
    overflow: 'hidden',          // clip children to rounded corners
  },
  list: {
    paddingHorizontal: 16, // horizontal breathing room for bubbles
    paddingVertical: 8,
  },
  bubble: {
    flexDirection: 'row',  // avatar + bubble side by side
    marginVertical: 6,
    alignItems: 'flex-end', // align avatar to bottom of bubble
  },
  userBubble: {
    justifyContent: 'flex-end', // push user bubble to the right
  },
  botBubble: {
    justifyContent: 'flex-start', // keep bot bubble on the left
  },
  bubbleInner: {
    maxWidth: '78%',       // prevent bubbles from spanning the full width
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userInner: {
    backgroundColor: '#3977fd',  // blue for user messages
    borderBottomRightRadius: 4,  // flattened corner points toward the user side
  },
  botInner: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,   // flattened corner points toward the bot avatar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff', // white text on blue background
  },
  botText: {
    color: '#1F2937', // dark text on white background (used as fallback)
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,            // perfect circle
    backgroundColor: '#3977fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,             // slight lift so avatar sits at bubble baseline
  },
  botAvatarText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  typingBubble: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',    // align send button to bottom of multi-line input
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // subtle separator between list and input bar
    gap: 10,                   // space between text field and send button
  },
  textInput: {
    flex: 1,                    // take all remaining width
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
    maxHeight: 120,             // cap height so it doesn't push the send button off screen
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,           // circle
    backgroundColor: '#3977fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#93C5FD', // lighter blue when disabled
  },
  sendBtnPressed: {
    opacity: 0.8, // slight dim on press
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    width: 64,  // matches the visual weight of the previous emoji placeholder
    height: 64,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});

// ─── Markdown styles applied to bot message bubbles ──────────────────────────

const markdownStyles = {
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1F2937', // default text colour inside markdown
  },
  strong: {
    fontWeight: '700' as const,
    color: '#1D4ED8',  // blue highlight for bold keywords
  },
  em: {
    fontStyle: 'italic' as const,
    color: '#374151', // slightly muted italic text
  },
  bullet_list: {
    marginVertical: 4, // breathing room above/below unordered lists
  },
  ordered_list: {
    marginVertical: 4, // breathing room above/below ordered lists
  },
  list_item: {
    marginVertical: 2, // space between individual list entries
  },
  code_inline: {
    backgroundColor: '#E5E7EB', // light grey pill for inline code
    borderRadius: 4,
    paddingHorizontal: 4,
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#DC2626', // red text for inline code — visually distinct
  },
  fence: {
    backgroundColor: '#F3F4F6', // slightly darker background for code blocks
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: '#1F2937',
  },
  heading1: { fontSize: 18, fontWeight: '700' as const, color: '#111827', marginVertical: 6 }, // largest heading
  heading2: { fontSize: 16, fontWeight: '700' as const, color: '#111827', marginVertical: 4 }, // section heading
  heading3: { fontSize: 15, fontWeight: '600' as const, color: '#374151', marginVertical: 4 }, // sub-section heading
};
