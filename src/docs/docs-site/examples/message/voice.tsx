import { useEffect, useState } from "react"

import { Avatar } from "@/components/ui/avatar"
import { Message, MessageGroup, MessageMeta, VoiceMessage } from "@/components/ui/message"

const DURATION = 14

export default function MessageVoice() {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          setPlaying(false)
          return 0
        }
        return Math.min(1, p + 0.1 / DURATION)
      })
    }, 100)
    return () => clearInterval(t)
  }, [playing])

  return (
    <MessageGroup avatar={<Avatar name="Maya Lindqvist" size="sm" />} footer={<MessageMeta>Voice note · 10:15</MessageMeta>} className="w-full max-w-md">
      <Message variant="card">
        <VoiceMessage duration={DURATION} progress={progress} isPlaying={playing} onPlayingChange={setPlaying} />
      </Message>
    </MessageGroup>
  )
}
