"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Actions, Action } from "@/components/ai-elements/actions";
import { Fragment, useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import Image from "next/image";
import { Response } from "@/components/ai-elements/response";
import {
  /* GlobeIcon, */ RefreshCcwIcon,
  CopyIcon,
  PaperclipIcon,
} from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";

const models = [
  {
    name: "GPT 4o",
    value: "openai/gpt-4o",
  },
  {
    name: "GPT 4.1",
    value: "openai/gpt-4.1",
  },
  {
    name: "Deepseek R1",
    value: "deepseek/deepseek-r1",
  },
];

const ChatBotDemo = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  // const [webSearch, setWebSearch] = useState(false);
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, sendMessage, status, regenerate } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || (files && files.length > 0)) {
      sendMessage(
        {
          text: input,
          files: files,
        },
        {
          body: {
            model: model,
            // webSearch: webSearch,
          },
        }
      );
      setInput("");
      setFiles(undefined);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" &&
                  message.parts.filter((part) => part.type === "source-url")
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === "source-url"
                          ).length
                        }
                      />
                      {message.parts
                        .filter((part) => part.type === "source-url")
                        .map((part, i) => (
                          <SourcesContent key={`${message.id}-${i}`}>
                            <Source
                              key={`${message.id}-${i}`}
                              href={part.url}
                              title={part.url}
                            />
                          </SourcesContent>
                        ))}
                    </Sources>
                  )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                          {message.role === "assistant" &&
                            i === messages.length - 1 && (
                              <Actions className="mt-2">
                                <Action
                                  onClick={() => regenerate()}
                                  label="Retry"
                                >
                                  <RefreshCcwIcon className="size-3" />
                                </Action>
                                <Action
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </Action>
                              </Actions>
                            )}
                        </Fragment>
                      );
                    case "file":
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <div className="mt-2">
                                {part.mediaType?.startsWith("image/") ? (
                                  <Image
                                    src={part.url}
                                    alt={part.filename || "Uploaded image"}
                                    width={400}
                                    height={300}
                                    className="max-w-md rounded-lg"
                                    style={{ objectFit: "contain" }}
                                  />
                                ) : part.mediaType === "application/pdf" ? (
                                  <div className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span>📄</span>
                                      <span className="font-medium">
                                        {part.filename || "PDF Document"}
                                      </span>
                                    </div>
                                    <iframe
                                      src={part.url}
                                      className="w-full h-96 border rounded"
                                      title={part.filename || "PDF"}
                                    />
                                  </div>
                                ) : (
                                  <div className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center gap-2">
                                      <PaperclipIcon className="size-4" />
                                      <span className="font-medium">
                                        {part.filename || "File"}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        ({part.mediaType})
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </MessageContent>
                          </Message>
                        </Fragment>
                      );
                    case "reasoning":
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={
                            status === "streaming" &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          {/* File Preview */}
          {files && files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {Array.from(files).map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm"
                >
                  <PaperclipIcon size={14} />
                  <span>{file.name}</span>
                  <button
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                      setFiles(undefined);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <PromptInputToolbar>
            <PromptInputTools>
              {/* <PromptInputButton
                variant={webSearch ? "default" : "ghost"}
                onClick={() => setWebSearch(!webSearch)}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton> */}

              {/* File Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(event) => {
                    if (event.target.files) {
                      setFiles(event.target.files);
                    }
                  }}
                  accept="image/*,application/pdf,.txt,.md,.doc,.docx"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <PromptInputButton
                  variant={files && files.length > 0 ? "default" : "ghost"}
                  type="button"
                  className="group transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:bg-primary/10 active:scale-95"
                >
                  <PaperclipIcon
                    size={16}
                    className="transition-transform duration-200 group-hover:rotate-12"
                  />
                  <span>
                    {files && files.length > 0
                      ? `${files.length} file${files.length > 1 ? "s" : ""}`
                      : "Attach"}
                  </span>
                </PromptInputButton>
              </div>

              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem
                      key={model.value}
                      value={model.value}
                    >
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={!input.trim() && (!files || files.length === 0)}
              status={status}
            />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default ChatBotDemo;
