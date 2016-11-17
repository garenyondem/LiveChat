using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace LiveChat.Shared.Helpers
{
    public class Request
    {
        public static async Task<T> PostAsync<T>(string url, string serializedBody)
        {
            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromMinutes(2);
                using (HttpResponseMessage response = await httpClient.PostAsync(url, new StringContent(serializedBody, Encoding.UTF8, "application/json")))
                {
                    string responseString = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<T>(responseString);
                }
            }
        }
    }
}
