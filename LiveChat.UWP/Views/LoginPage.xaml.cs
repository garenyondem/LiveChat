using LiveChat.Shared.Constants;
using LiveChat.Shared.Helpers;
using LiveChat.Shared.Models;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using Windows.UI.Xaml.Controls;

namespace LiveChat.UWP.Views
{
    public sealed partial class LoginPage : Page
    {
        public string UserName { get; set; }
        public string Password { get; set; }

        public LoginPage()
        {
            InitializeComponent();
        }

        private async void LoginButton_Click(object sender, Windows.UI.Xaml.RoutedEventArgs e)
        {
            await CreateOrLoginUser(Config.LoginEndPoint);
        }

        private async void NewUserButton_Click(object sender, Windows.UI.Xaml.RoutedEventArgs e)
        {
            await CreateOrLoginUser(Config.NewUserEndPoint);
        }

        async Task CreateOrLoginUser(string url)
        {
            UserName = UserNameTextBox.Text;
            Password = PasswordTextBox.Password;
            var reqVal = new LoginCredentials()
            {
                name = UserName,
                password = Password
            };
            var loginRoot = await Request.PostAsync<LoginRoot>(url, JsonConvert.SerializeObject(reqVal));
            if (loginRoot.status.success == true && !string.IsNullOrEmpty(loginRoot.token))
            {
                Frame.Navigate(typeof(MainPage));
            }
            else
            {
                new Dialog().ShowText(loginRoot.status.reason);
            }
        }
    }
}
