module.exports = (req, res) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.claudeter.ai/</loc><lastmod>2026-03-08</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.claudeter.ai/blog/</loc><lastmod>2026-03-08</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-voice-agents-insurance-follow-up/</loc><lastmod>2026-03-05</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/prior-auth-automation-denial-rates/</loc><lastmod>2026-03-03</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/real-cost-manual-claims-follow-up/</loc><lastmod>2026-02-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-agents-payer-ivr-navigation/</loc><lastmod>2026-02-24</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/dha-eclaims-tpa-automation-uae/</loc><lastmod>2026-02-20</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/nextcare-nas-neuron-automation/</loc><lastmod>2026-02-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/what-ai-agencies-wont-tell-you/</loc><lastmod>2026-02-13</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/why-we-ship-in-6-weeks/</loc><lastmod>2026-02-10</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-agents-vs-rpa/</loc><lastmod>2026-02-06</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/hipaa-compliant-ai-what-devs-get-wrong/</loc><lastmod>2026-02-03</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-automation-banking-fintech/</loc><lastmod>2026-03-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-automation-construction-engineering/</loc><lastmod>2026-03-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-automation-education-edtech/</loc><lastmod>2026-03-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-automation-hospitality-hotels/</loc><lastmod>2026-03-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-automation-logistics-supply-chain/</loc><lastmod>2026-03-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-automation-real-estate-proptech/</loc><lastmod>2026-03-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-automation-restaurant-industry/</loc><lastmod>2026-03-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-automation-retail-ecommerce/</loc><lastmod>2026-03-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-voice-agents-across-industries/</loc><lastmod>2026-03-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.claudeter.ai/blog/ai-voice-agents-airline-industry/</loc><lastmod>2026-03-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(sitemap);
};
