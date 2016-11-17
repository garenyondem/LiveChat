using LiveChat.Shared.Interfaces;
using LiveChat.Shared.Models;
using LiveChat.UWP.Helpers;
using LiveChat.UWP.Services;
using Newtonsoft.Json;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Input;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace LiveChat.UWP.Views
{
    public sealed partial class MainPage : Page
    {
        public static ObservableCollection<string> MessagesListView { get; set; } = new ObservableCollection<string>();

        ISocketService socketService;
        public string ThreadId { get; set; }
        public string UserId { get; set; }
        public string OrderId { get; set; }

        public MainPage()
        {
            InitializeComponent();
            DataContext = this;
            socketService = new SocketService("http://127.0.0.1:4085");
            AttachSocketEvents(socketService);
        }

        void AttachSocketEvents(ISocketService socketService)
        {
            socketService.On(SocketService.EVENT_CONNECT, (data) =>
            {
                ViewMessage("connection OK").Wait();
            });
            socketService.On("message_sent", (data) =>
            {
                var response = JsonConvert.DeserializeObject<Message>(data[0].ToString());
                ViewMessage(response.userId + " : " + response.message).Wait();
            });
            socketService.On("thread_data", (data) =>
            {
                ThreadId = data[0].ToString();
            });
        }

        async Task ViewMessage(string msg)
        {
            await DispatcherHelper.ExecuteOnUIThreadAsync(() =>
            {
                MessagesListView.Add(msg);
            });
        }

        private void SendButton_Click(object sender, RoutedEventArgs e)
        {
            var message = new Message()
            {
                threadId = ThreadId,
                message = MessageTextBox.Text,
                orderId = OrderId,
                userId = UserId
            };
            socketService.Emit("new_message", JsonConvert.SerializeObject(message));
            MessageTextBox.Text = string.Empty;
        }

        private void SetButton_Click(object sender, RoutedEventArgs e)
        {
            UserId = UserIdTextBox.Text;
            OrderId = OrderIdTextBox.Text;
            var threadKey = UserId + "-" + OrderId;
            socketService.Emit("subscribe", threadKey);
        }
    }
}
