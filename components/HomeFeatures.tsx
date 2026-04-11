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
      description: "Based in Split and Dubrovnik, the heart of Adriatic nautical tourism.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Croatia_location_map.svg/800px-Croatia_location_map.svg.png",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: "Asset Backed",
      description: "Your investment is secured by physical, high-value luxury yacht assets.",
      image: "https://images.pexels.com/photos/1209978/pexels-photo-1209978.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
      title: "Tax Optimized",
      description: "Efficient structure leveraging local nautical tax benefits for EU investors.",
      image: "https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div key={f.title} className="bg-[#f6f7f8] rounded-2xl overflow-hidden border border-gray-100">
            <div className="p-6">
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
