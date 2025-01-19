export class YouTubeAdFetcher {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://www.googleapis.com/youtube/v3";
  }

  async searchVideos(contentType: string) {
    try {
      // First, search for videos related to the content type
      const searchResponse = await fetch(
        `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(
          contentType
        )}&type=video&maxResults=10&key=${this.apiKey}`
      );

      if (!searchResponse.ok) {
        throw new Error("Failed to fetch videos");
      }

      const searchData = await searchResponse.json();
      const videoIds = searchData.items
        .map((item: any) => item.id.videoId)
        .join(",");

      // Then get detailed ad information for these videos
      const videoResponse = await fetch(
        `${this.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${this.apiKey}`
      );

      if (!videoResponse.ok) {
        throw new Error("Failed to fetch video details");
      }

      const videoData = await videoResponse.json();
      return this.processAdData(videoData.items);
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
      throw error;
    }
  }

  processAdData(videos: any) {
    return videos.map((video: any) => ({
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      viewCount: video.statistics.viewCount,
      adFormats: this.getAdFormats(video),
      monetizationStatus: this.getMonetizationStatus(video),
      estimatedRevenue: this.calculateEstimatedRevenue(video),
    }));
  }

  getAdFormats(video: any) {
    // Note: This is a simplified version. Actual ad formats would come from the API
    const formats = [];
    if (video.advertisingOptions) {
      if (video.advertisingOptions.displayAds) formats.push("Display");
      if (video.advertisingOptions.overlayAds) formats.push("Overlay");
      if (video.advertisingOptions.videoAds) formats.push("Video");
    }
    return formats;
  }

  getMonetizationStatus(video: any) {
    // Simplified monetization status check
    return video.monetizationDetails?.monetizationStatus || "Unknown";
  }

  calculateEstimatedRevenue(video: any) {
    // This is a simplified estimation formula
    // Actual revenue calculation would be much more complex
    const views = parseInt(video.statistics.viewCount);
    const estimatedCPM = 2.5; // Average CPM in USD
    return ((views / 1000) * estimatedCPM).toFixed(2);
  }
}
