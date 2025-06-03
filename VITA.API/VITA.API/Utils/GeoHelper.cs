using System.Globalization;
using System.Net.Http.Headers;
using System.Text.Json;

namespace VITA.API.Utils
{
    public static class GeoHelper
    {
        private const string UrlTpl =
            "https://nominatim.openstreetmap.org/reverse?format=jsonv2" +
            "&lat={0}&lon={1}&accept-language=pt-BR";

        private static readonly HttpClient _http = new();
        private static readonly MemoryCache<string, string> _cache = new();

        public static async Task<string> ReverseAsync(double lat, double lon)
        {
            var key = $"{lat.ToString("F5", CultureInfo.InvariantCulture)}|" +
                      $"{lon.ToString("F5", CultureInfo.InvariantCulture)}";
            if (_cache.TryGet(key, out var v)) return v;

            var url = string.Format(CultureInfo.InvariantCulture, UrlTpl, lat, lon);
            var req = new HttpRequestMessage(HttpMethod.Get, url);
            req.Headers.UserAgent.Add(new ProductInfoHeaderValue("VITA-App", "1.0"));

            var resp = await _http.SendAsync(req);
            if (!resp.IsSuccessStatusCode) return "";

            var body = await resp.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(body);

            var full = doc.RootElement.GetProperty("display_name").GetString() ?? "";
            _cache.Set(key, full);
            return full;
        }
    }

    internal class MemoryCache<K, V> where K : notnull
    {
        private readonly Dictionary<K, (DateTime, V)> _d = new();
        private readonly TimeSpan _ttl = TimeSpan.FromDays(1);
        public bool TryGet(K k, out V v)
        {
            if (_d.TryGetValue(k, out var t) && DateTime.UtcNow - t.Item1 < _ttl)
            { v = t.Item2; return true; }
            v = default!; return false;
        }
        public void Set(K k, V v) => _d[k] = (DateTime.UtcNow, v);
    }
}
