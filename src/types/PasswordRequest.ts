import { PublishMessage } from './PublishMessage'

export interface PasswordRequest extends PublishMessage {
  currentPassword: string
  newPassword: string
}
