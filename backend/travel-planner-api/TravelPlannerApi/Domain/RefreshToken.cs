namespace TravelPlannerApi.Domain
{
    public class RefreshToken
    {
        public string Token { get; set; } = Guid.NewGuid().ToString();

        public required DateTime ExpirationDate { get; set; }
    }
}
