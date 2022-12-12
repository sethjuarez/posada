import "./index.css";
import { useState, useRef } from "react";
import { FileBlockProps } from "@githubnext/blocks";
import {
  Box,
  FormControl,
  TextInput,
  IconButton,
  Spinner,
} from "@primer/react";
import {
  PaperAirplaneIcon,
  PersonIcon,
  CopilotIcon,
  SyncIcon,
} from "@primer/octicons-react";

interface Context {
  question: string;
  answer: string;
}

interface ChatResponse {
  response: string;
}

const InferenceBlock = (props: FileBlockProps) => {
  //const { context, content, metadata, onUpdateMetadata } = props;
  const [conversation, setConversation] = useState<Context[]>([]);
  const promptRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState<string>("");
  const model = JSON.parse(props.content);
  const inferenceurl =
    model.runtime + (model.runtime.endsWith("/") ? "" : "/") + model.api;

  const sendPrompt = () => {
    if (promptRef && promptRef.current && promptRef.current.value.length > 0) {
      setQuery(promptRef.current.value);
      
      

      const request = {
        question: promptRef.current.value,
        context: conversation.map((c) => c),
      };

      console.log(request);

      const options: RequestInit = {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(query);

      fetch(inferenceurl, options)
        .then((response) => {
          response.json().then((data) => {
            if (promptRef && promptRef.current) {
              setConversation([
                ...conversation,
                { question: promptRef.current.value, answer: data.response },
              ]);
              setQuery("");
              promptRef.current.value = "";
            }
          });
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <Box p={4}>
      <Box
        borderColor="border.default"
        borderWidth={1}
        borderStyle="solid"
        borderRadius={6}
        overflow="hidden"
      >
        <Box
          bg="canvas.subtle"
          p={3}
          borderBottomWidth={1}
          borderBottomStyle="solid"
          borderColor="border.default"
          display="flex"
        >
          <Box flexGrow={1} sx={{ fontSize: "20px", fontWeight: "bold" }}>
            {model.title}
          </Box>
          <Box>
            {conversation.length > 0 && (
              <IconButton
                aria-label="Restart"
                icon={SyncIcon}
                onClick={() => setConversation([])}
              />
            )}
          </Box>
        </Box>
        {conversation.length > 0 && (
          <Box pt={4} pl={4} pr={4}>
            <Box>
              {conversation.map((c, i) => (
                <Box key={i}>
                  <Box
                    borderRadius={2}
                    bg="canvas.default"
                    color="fg.default"
                    p={3}
                    display="flex"
                  >
                    <Box pr={4}>
                      <PersonIcon size={48} />
                    </Box>
                    <Box>{c.question}</Box>
                  </Box>
                  <Box
                    borderRadius={2}
                    bg="success.subtle"
                    color="success.fg"
                    p={3}
                    display="flex"
                  >
                    <Box pr={4}>
                      <CopilotIcon size={48} />
                    </Box>
                    <Box>{c.answer}</Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {query.length > 0 && (
          <Box pt={4} pl={4} pr={4}>
            <Box>
              <Box>
                <Box
                  borderRadius={2}
                  bg="canvas.default"
                  color="fg.default"
                  p={3}
                  display="flex"
                >
                  <Box pr={4}>
                    <PersonIcon size={48} />
                  </Box>
                  <Box>{query}</Box>
                </Box>
                <Box
                  borderRadius={2}
                  bg="success.subtle"
                  color="success.fg"
                  p={3}
                  display="flex"
                >
                  <Box pr={6} alignItems={"center"}>
                    <Spinner size="medium" />
                  </Box>
                  <Box>{query.endsWith('?') ? 'Great question, let me think about it for a sec...' : 'Let me think about that for a sec...'}</Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        <Box p={4}>
          <FormControl>
            <FormControl.Label visuallyHidden={true}>
              Send Message
            </FormControl.Label>
            <TextInput
              ref={promptRef}
              placeholder={model.ui.panel.text}
              onKeyUp={(e) => {
                if (e.key === "Enter") sendPrompt();
              }}
              trailingAction={
                <TextInput.Action
                  onClick={sendPrompt}
                  icon={PaperAirplaneIcon}
                  aria-label="Send"
                  sx={{ color: "fg.subtle" }}
                />
              }
            />
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default InferenceBlock;
