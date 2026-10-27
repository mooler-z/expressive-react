import { Avatar } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { Message, MessageActions, MessageGroup, MessageMeta } from "@/components/ui/message"
import { snackbar } from "@/components/ui/snackbar"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"

export default function MessageActionsExample() {
  return (
    <MessageGroup avatar={<Avatar name="Maya Lindqvist" size="sm" />} footer={<MessageMeta>Maya · 09:41</MessageMeta>} className="w-full max-w-lg">
      <div className="flex w-full items-center gap-2">
        <Message>Hover or focus this message for quick actions.</Message>
        <MessageActions>
          <TooltipTrigger>
            <IconButton size="xs" aria-label="Reply" onPress={() => snackbar("Replying to Maya")}>
              <Icon name="reply" />
            </IconButton>
            <Tooltip>Reply</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <IconButton size="xs" aria-label="Copy text" onPress={() => snackbar("Message copied")}>
              <Icon name="content_copy" />
            </IconButton>
            <Tooltip>Copy</Tooltip>
          </TooltipTrigger>
          <MenuTrigger>
            <IconButton size="xs" aria-label="More actions">
              <Icon name="more_vert" />
            </IconButton>
            <MenuPopover placement="bottom end">
              <Menu onAction={(key) => snackbar(`${key}`)}>
                <MenuItem id="Pinned" icon="keep">
                  Pin
                </MenuItem>
                <MenuItem id="Forwarded" icon="forward">
                  Forward
                </MenuItem>
                <MenuItem id="Marked unread" icon="mark_chat_unread">
                  Mark unread
                </MenuItem>
              </Menu>
            </MenuPopover>
          </MenuTrigger>
        </MessageActions>
      </div>
    </MessageGroup>
  )
}
