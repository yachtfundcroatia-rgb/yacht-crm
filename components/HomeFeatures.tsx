export default function HomeFeatures() {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      title: "Prime Locations",
      description: "Our catamaran fleet is strategically stationed across all the most popular and premium marinas in Croatia, ensuring maximum occupancy and charter demand.",
      image: "https://rhmgpxpirrclysplitzz.supabase.co/storage/v1/object/public/assets/Gemini_Generated_Image_wox8t3wox8t3wox8.png",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: "Asset Backed",
      description: "Your investment is secured by physical, high-value luxury yacht assets. Investing exclusively in high-demand yacht models like the Lagoon 42, known for stability, space, and resale value.",
      image: "https://rhmgpxpirrclysplitzz.supabase.co/storage/v1/object/public/assets/2613e00b-e4ca-4e4c-ad25-0ad26d014a5a.png"
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      title: "Predictable Yields",
      description: "A structured 6-year investment path with transparent annual payouts and a clear capital exit strategy.",
      image: "https://rhmgpxpirrclysplitzz.supabase.co/storage/v1/object/public/assets/e1d748fc-a959-4a95-be83-cfe8652c833d.png",
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div key={f.title} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md flex flex-col">
            <div className="p-6 flex-1">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-xl font-black text-[#0a192f] mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{f.description}</p>
            </div>
            <div
              className="h-44 bg-cover bg-center"
              style={{ backgroundImage: `url(${f.image})` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
