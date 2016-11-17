namespace LiveChat.Shared.Constants
{
    public static class Config
    {
        public const string ServerBase = "http://127.0.0.1";
        public const string ServerPort = "4085";
        public const string ApiLevel = "/api/v1/";
        public const string LoginEndPoint = ServerBase + ":" + ServerPort + ApiLevel + "login";
        public const string NewUserEndPoint = ServerBase + ":" + ServerPort + ApiLevel + "createUser";
        public const string GetUserEndPoint = ServerBase + ":" + ServerPort + ApiLevel + "getUser";
    }
}
