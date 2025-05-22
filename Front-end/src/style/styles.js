import { StyleSheet } from "react-native";

export default StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontStyle: 'italic',
    color: "white",
  },
  text_form: {
    fontSize: 17,
    textAlign: "center",
    marginBottom: 30,
    color: "white",
  },
  input: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderRadius: 20,
    borderColor: "white",
    color: "black",
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
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
    lineHeight: 25,
  },
  containers: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  containers_p: {
    padding: 20,
  },
  chatHeader: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: "rgba(0, 0, 0, 0.83)",
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
    color: "white",
    marginTop: 0,
    fontWeight: "bold"
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
    backgroundColor: "#A3C1E2",
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
    backgroundColor: "#63CD5D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
  },
  chatSendText: {
    color: "black",
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: 16,
  },
  predictionCard: {
    marginTop: 20,
    marginBottom: 20,
  },
  predictionImage: {
    width: 200,
    height: 200,
    display: "block",
    margin: 'auto',
  },
  predictionType: {
    width: '80%',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 15,
  },
  predictionDescription: {
    width: '80%',
    fontSize: 18,
  }
});
