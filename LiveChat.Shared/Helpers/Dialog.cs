using System;
using Windows.UI.Popups;

namespace LiveChat.Shared.Helpers
{
    public class Dialog
    {
        MessageDialog msgDialog;

        public async void ShowText(string text)
        {
            msgDialog = new MessageDialog(text);
            await msgDialog.ShowAsync();
        }
    }
}
