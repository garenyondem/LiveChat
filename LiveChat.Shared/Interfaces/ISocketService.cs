using System;

namespace LiveChat.Shared.Interfaces
{
    public interface ISocketService
    {
        void Connect();
        void Close();
        void On(string eventName, Action<object> listener);
        void On(string eventName, Action<object[]> listener);
        void Emit(string message);
        void Emit(string message, string messageBody);
    }
}
