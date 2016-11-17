using LiveChat.Shared.Interfaces;
using Quobject.SocketIoClientDotNet.Client;
using System;

namespace LiveChat.UWP.Services
{
    public class SocketService : ISocketService
    {
        public static readonly string EVENT_CONNECT = "connect";
        public static readonly string EVENT_CONNECT_ERROR = "connect_error";
        public static readonly string EVENT_CONNECT_TIMEOUT = "connect_timeout";
        public static readonly string EVENT_DISCONNECT = "disconnect";
        public static readonly string EVENT_ERROR = "error";
        public static readonly string EVENT_MESSAGE = "message";
        public static readonly string EVENT_RECONNECT = "reconnect";
        public static readonly string EVENT_RECONNECTING = "reconnecting";
        public static readonly string EVENT_RECONNECT_ATTEMPT = "reconnect_attempt";
        public static readonly string EVENT_RECONNECT_ERROR = "reconnect_error";
        public static readonly string EVENT_RECONNECT_FAILED = "reconnect_failed";

        Socket _socket { get; set; }

        public SocketService(string url)
        {
            _socket = IO.Socket(url);
        }

        public void Close()
        {
            _socket.Close();
        }

        public void Connect()
        {
            _socket.Connect();
        }

        public void Emit(string message)
        {
            _socket.Emit(message);
        }

        public void Emit(string message, string messageBody)
        {
            _socket.Emit(message, messageBody);
        }

        public void On(string eventName, Action<object> listener)
        {
            _socket.On(eventName, (data) =>
            {
                listener.Invoke(new { data });
            });
        }

        public void On(string eventName, Action<object[]> listener)
        {
            _socket.On(eventName, (data) =>
            {
                listener.Invoke(new object[] { data });
            });
        }
    }
}
