"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { ExternalLink, LinkIcon, Copy, Check, ThumbsUp, ThumbsDown, Sparkles, Brain, Share } from "lucide-react"
import { cn } from "@/lib/utils"

interface Source {
  id: number
  title: string
  url: string
  content: string
}

interface ImageResult {
  url: string
  sourceUrl?: string
  title?: string
}

interface ChatMessage {
  sender: "user" | "bot"
  content: string
  mode?: "chat" | "research"
  sources?: Source[]
  images?: ImageResult[]
  loading?: boolean
}

export default function Messages({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6">
      {messages.map((m, i) =>
        m.sender === "user" ? <UserBubble key={i} content={m.content} /> : <BotMessage key={i} message={m} />,
      )}
    </div>
  )
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl bg-zinc-800/70 px-5 py-3 text-[15px] leading-relaxed shadow-md border border-zinc-700/60">
        {content}
      </div>
    </div>
  )
}

// Loading dots animation component
function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 py-4 px-1">
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
      </div>
      <span className="text-sm text-zinc-500 ml-2">
        
        <Brain /> Thinking...</span>
    </div>
  )
}

// Code block with copy button
function CodeBlock({
  language,
  children,
}: {
  language: string
  children: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy", err)
    }
  }

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-zinc-700/60 bg-zinc-950">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/80 border-b border-zinc-700/60">
        <span className="text-xs text-zinc-400 font-mono">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <SyntaxHighlighter
        language={language || "text"}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "0.875rem",
        }}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-mono)",
          },
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

// Message action buttons
 function MessageActions({
  content,
  feedback,
  onFeedback,
}: {
  content: string
  feedback: "up" | "down" | null
  onFeedback: (type: "up" | "down") => void
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center gap-4 text-zinc-400">

      {/* COPY */}
      <button
        onClick={handleCopy}
        className="hover:text-white transition-colors"
        title="Copy"
      >
        {copied
          ? <Check className="w-4 h-4" />
          : <Copy className="w-4 h-4" />
        }
      </button>

      {/* LIKE */}
      <button
        onClick={() => onFeedback("up")}
        className="hover:text-white transition-colors"
        title="Good response"
      >
        <ThumbsUp
          className="w-4 h-4"
          fill={feedback === "up" ? "white" : "none"}
        />
      </button>

      {/* DISLIKE */}
      <button
        onClick={() => onFeedback("down")}
        className="hover:text-white transition-colors"
        title="Bad response"
      >
        <ThumbsDown
          className="w-4 h-4"
          fill={feedback === "down" ? "white" : "none"}
        />
      </button>

      {/* SHARE (optional like screenshot) */}
      <button
        onClick={() => console.log("Share clicked")}
        className="hover:text-white transition-colors"
        title="Share"
      >
        <Share className="w-4 h-4" />
      </button>
    </div>
  )
}

function BotMessage({ message }: { message: ChatMessage }) {
  const hasLinks = (message.sources || []).length > 0
  const hasImages = (message.images || []).length > 0
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)

  // Handle loading state
  if (message.loading) {
    return (
      <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <LoadingDots />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* AI Avatar */}
      {/* <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4 text-white" />
      </div> */}

      <div className="flex-1 min-w-0">
        <Tabs defaultValue="answer" className="w-full">
          {(hasLinks || hasImages) && (
            <TabsList className="mb-3 bg-zinc-900/60 border border-zinc-800/80 p-1 rounded-xl inline-flex">
              <TabsTrigger
                value="answer"
                className="data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900 rounded-lg px-3 py-1 text-xs sm:text-[13px] transition-all"
              >
                Answer
              </TabsTrigger>
              {hasLinks && (
                <TabsTrigger
                  value="links"
                  className="data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900 rounded-lg px-3 py-1 text-xs sm:text-[13px] transition-all"
                >
                  Sources ({message.sources!.length})
                </TabsTrigger>
              )}
              {hasImages && (
                <TabsTrigger
                  value="images"
                  className="data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900 rounded-lg px-3 py-1 text-xs sm:text-[13px] transition-all"
                >
                  Images ({message.images!.length})
                </TabsTrigger>
              )}
            </TabsList>
          )}

          {/* ANSWER TAB */}
          <TabsContent value="answer" className="mt-0">
            {/* Image preview strip */}
            {hasImages && message.images!.length > 0 && (
              <div className="mb-4 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                {message.images!.slice(0, 5).map((img, idx) => (
                  <div key={idx} className="relative group shrink-0">
                    <img
                      src={img.url || "/placeholder.svg"}
                      alt={img.title || "result image"}
                      className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover border border-zinc-700/60 group-hover:border-zinc-500 transition-all shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Main markdown content with code blocks */}
            <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-3 leading-relaxed text-zinc-100 text-[14px] sm:text-[15px]">{children}</p>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300 transition-colors"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-3 space-y-1.5 list-disc list-inside text-zinc-100">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-3 space-y-1.5 list-decimal list-inside text-zinc-100">{children}</ol>
                  ),
                  // Inline code (single backticks)
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "")
                    const isInline = !className
                    const codeString = String(children).replace(/\n$/, "")

                    if (isInline) {
                      return (
                        <code className="bg-zinc-800/80 px-1.5 py-0.5 rounded text-sm text-emerald-400 font-mono">
                          {children}
                        </code>
                      )
                    }

                    // Block code (triple backticks) - handled by pre
                    return <CodeBlock language={match ? match[1] : ""}>{codeString}</CodeBlock>
                  },
                  // Code blocks
                  pre: ({ children }) => {
                    return <>{children}</>
                  },
                  h1: ({ children }) => <h1 className="text-xl font-semibold text-zinc-100 mt-6 mb-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold text-zinc-100 mt-5 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold text-zinc-100 mt-4 mb-2">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-zinc-600 pl-4 italic text-zinc-400 my-3">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Action buttons */}
            <MessageActions
              content={message.content}
              feedback={feedback}
              onFeedback={(type) => setFeedback(feedback === type ? null : type)}
            />
          </TabsContent>

          {/* LINKS TAB */}
          {hasLinks && (
            <TabsContent value="links" className="mt-1">
              <div className="space-y-3">
                {message.sources!.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-4 sm:p-5 hover:border-zinc-500 hover:bg-zinc-900/70 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="font-semibold text-sm sm:text-[15px] text-zinc-100 group-hover:text-blue-400 transition-colors flex-1">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs mr-2 border border-zinc-700">
                          {s.id}
                        </span>
                        {s.title || new URL(s.url).hostname}
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors shrink-0" />
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-400 line-clamp-2 mb-2 pl-8">{s.content}</div>
                    <div className="text-[11px] text-zinc-500 pl-8 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />
                      {new URL(s.url).hostname}
                    </div>
                  </a>
                ))}
              </div>
            </TabsContent>
          )}

          {/* IMAGES TAB */}
          {hasImages && (
            <TabsContent value="images" className="mt-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {message.images!.map((img, idx) => (
                  <a
                    key={idx}
                    href={img.sourceUrl || img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden border border-zinc-800/70 group-hover:border-zinc-500 transition-all shadow-sm">
                      <img
                        src={img.url || "/placeholder.svg"}
                        alt={img.title || "result image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {img.title && <div className="mt-2 text-xs text-zinc-400 line-clamp-2">{img.title}</div>}
                  </a>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
