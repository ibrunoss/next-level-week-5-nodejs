let socketAdmId  = null;
let socketClient = null;

document.querySelector("#start_chat").addEventListener("click", (event) => {
  const chatHelp = document.getElementById("chat_help");
  chatHelp.style.display = "none";

  const chatInSupport = document.getElementById("chat_in_support");
  chatInSupport.style.display = "block";

  socketClient = io();
  const email  = document.getElementById("email").value;
  const text   = document.getElementById("txt_help").value;
  
  socketClient.on("connect", () => {
    const params = {
      email,
      text,
    }
    socketClient.emit("client_first_access", params, (call, err) => {
      if(err) {
        console.error(err);
      } else {
        console.log(call);
      }
    });
  });

  socketClient.on("client_list_all_messages", messages => {
    messages.forEach(message => {
      const render = {
        data: {
          message: message.text,
        }
      }
      
      if (message.adminId === null) {
        render.target     = "messages";
        render.template   = document.getElementById("message-user-template").innerHTML;
        render.data.email = email;
      } else {
        render.target   = "messages";
        render.template = document.getElementById("admin-template").innerHTML;
      }
      
      const rendered = Mustache.render(render.template, render.data);
      document.getElementById(render.target).innerHTML += rendered;
    });
  });

  socketClient.on("admin_send_to_client", message => {
    socketAdmId = message.socketId;
    const template = document.getElementById("admin-template").innerHTML;
    const rendered = Mustache.render(template, {
      message: message.text
    });
    document.getElementById("messages").innerHTML += rendered;
  });
});

document.getElementById("send_message_button").addEventListener("click", event => {
  const msgU  = document.getElementById("message_user");
  const email = document.getElementById("email").value;
  socketClient.emit("client_send_to_admin", {
    text: msgU.value,
    socketId: socketAdmId,
    email
  });
  const template = document.getElementById("message-user-template").innerHTML;
  const rendered = Mustache.render(template, {
    message: msgU.value,
    email
  });
  msgU.value = "";
  document.getElementById("messages").innerHTML += rendered;
});