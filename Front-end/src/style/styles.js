import { StyleSheet } from "react-native";

export default StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "white",
  },
  text_form: {
    fontSize: 17,
    textAlign: "center",
    marginBottom: 30,
    color: "white",
  },
  input: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderRadius: 0,
    borderColor: "white",
    color: "white",
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  container_bg: {
    backgroundColor: "rgba(0, 0, 0, 0.83)",
    flex: 1,
    justifyContent: "center",
    padding: 20,
    width: "100%",
    height: "100%",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#101517",
    marginBottom: 10,
  },
  infoTextItem: {
    fontSize: 16,
    color: "#101517",
    paddingLeft: 10,
    paddingBottom: 5,
    fontStyle: "italic",
  },
  descriptionText: {
    fontWeight: "600",
    fontSize: 17,
    fontStyle: "italic",
    paddingLeft: 10,
  },
  containers: {
    width: "100%",
    height: "100%",
  },
  containers_p: {
    padding: 20,
  },
  chatHeader: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  chatUserName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  chatStatus: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  chatScroll: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  chatBubble: {
    maxWidth: "70%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  chatUser: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  chatBot: {
    backgroundColor: "#F9F9F9",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  chatText: {
    fontSize: 16,
    color: "#000",
  },

  chatInputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
  },
  chatSendButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
  },
  chatSendText: {
    color: "#fff",
    fontSize: 16,
  },
});
