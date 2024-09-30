export enum SocketEmiterE {
  createSession = "chatbot:session:create",
  joinSession = "chatbot:session:join",
  sendMessage = "chatbot:message:send",
  messageActionUpdate = "chatbot:message:update",
  history = "chatbot:conversation:history",
  compose = "chatbot:message:compose",

  //NEW
  createVisitor = "chatbot:visitor:create",
  joinVisitor = "chatbot:visitor:join",
  navigation = "chatbot:navigation:create",
  messagesMarkSeen = "chatbot:message:markSeen",
  setVisitorData = "chatbot:visitor:setData",
  setSessionData = "chatbot:session:setData",
  setContactData = "chatbot:contact:setData",
  updateVisitorStatus = "chatbot:visitor:changeStatus",

  messagesDelivered = "chatbot:message:delivered",
}
export enum SocketListenE {
  sessionCreated = "chatbot:session:created",
  joined = "chatbot:session:joined",
  messageReceived = "chatbot:message:received",
  messageCompose = "chatbot:message:compose",
  connect = "connect",
  disconnect = "disconnect",
  messageEdited = "chatbot:message:edited",

  visitorStatusChanged = "chatbot:visitor:statusChanged",

  //NEW
  visitorCreated = "chatbot:visitor:created",
  sessionDeleted = "chatbot:session:deleted",
  visitorBlocked = "chatbot:visitor:blocked",
  visitorUnblocked = "chatbot:visitor:unblocked",
  messageDeleted = "chatbot:message:deleted",
}
