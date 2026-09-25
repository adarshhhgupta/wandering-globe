/**
 * Realistic Mock Trip Templates & Error Simulation Generators
 * Ensures the reviewer can run `npm install && npm start` and immediately test the app
 * even before configuring an API key.
 */

export const MOCK_TRIPS = {
  tokyo: {
    tripTitle: "Kyoto & Tokyo Neon to Zen Journey",
    destination: "Tokyo & Kyoto, Japan",
    durationDays: 3,
    summary: "A sensory contrast between historic moss-covered shrines, tranquil bamboo groves, and cutting-edge culinary culture in Shinjuku and Gion.",
    tripStyle: "Cultural & Foodie",
    estimatedTotalBudget: {
      currency: "USD",
      amount: 1180,
      breakdown: {
        activities: 260,
        food: 420,
        stay: 380,
        transport: 120
      }
    },
    packingHighlights: [
      "Slip-on shoes for frequent temple visits",
      "Pocket Wi-Fi or eSIM for navigation",
      "Coin purse for vending machines and traditional shops",
      "Lightweight umbrella for sporadic mist"
    ],
    localTips: [
      "Get a Suica or Pasmo digital card on your phone for all subways and conbini purchases",
      "Tipping is strictly not customary and can cause confusion",
      "Arrive at Fushimi Inari at 7:00 AM to experience the Torii gates in serene silence"
    ],
    days: [
      {
        dayNumber: 1,
        dateOrDay: "Day 1",
        theme: "Ancient Traditions & Lantern Lit Alleys",
        stops: [
          {
            id: "stop-1-1",
            title: "Fushimi Inari-Taisha Torii Path",
            time: "08:00 AM",
            durationMinutes: 120,
            category: "Sightseeing",
            description: "Ascend the iconic path beneath thousands of vermilion torii gates winding up the sacred Mount Inari.",
            costEstimate: 0,
            location: "Fushimi Ward, Kyoto",
            tips: "Bring water and climb past the halfway viewpoint to escape the morning crowds."
          },
          {
            id: "stop-1-2",
            title: "Nishiki Market Street Food Odyssey",
            time: "12:30 PM",
            durationMinutes: 75,
            category: "Food",
            description: "Sample skewered baby octopus, matcha warabi mochi, and fresh dashi tamagoyaki down Kyoto's Kitchen.",
            costEstimate: 28,
            location: "Nakagyo Ward, Kyoto",
            tips: "Eat in front of each stall; walking while eating is discouraged on the narrow avenue."
          },
          {
            id: "stop-1-3",
            title: "Kiyomizu-dera Wooden Stage Overlook",
            time: "03:15 PM",
            durationMinutes: 90,
            category: "Culture",
            description: "Wander the UNESCO wooden temple built without a single nail, offering panorama views over Kyoto cherry trees.",
            costEstimate: 10,
            location: "Higashiyama Ward, Kyoto",
            tips: "Drink from the Otowa Waterfall for health, longevity, or academic success."
          },
          {
            id: "stop-1-4",
            title: "Gion Twilight Geisha District Stroll",
            time: "06:45 PM",
            durationMinutes: 90,
            category: "Relaxation",
            description: "Traditional wooden machiya houses illuminated by red paper lanterns alongside the Shirakawa canal.",
            costEstimate: 45,
            location: "Gion District",
            tips: "Respect photography restrictions on private side streets."
          }
        ]
      },
      {
        dayNumber: 2,
        dateOrDay: "Day 2",
        theme: "Zen Gardens & Bamboo Whisperings",
        stops: [
          {
            id: "stop-2-1",
            title: "Arashiyama Bamboo Grove & Tenryu-ji",
            time: "08:30 AM",
            durationMinutes: 110,
            category: "Sightseeing",
            description: "Walk under the towering emerald stalks of bamboo and explore the 14th-century landscape garden.",
            costEstimate: 12,
            location: "Ukyo Ward, Kyoto",
            tips: "Rent a retro bicycle near Saga-Arashiyama station for exploring nearby temples."
          },
          {
            id: "stop-2-2",
            title: "Kinkaku-ji (The Golden Pavilion)",
            time: "12:00 PM",
            durationMinutes: 60,
            category: "Culture",
            description: "Admire the top two floors completely covered in brilliant gold leaf shimmering over Mirror Pond.",
            costEstimate: 15,
            location: "Kita Ward, Kyoto",
            tips: "Best light for photography hits the gold facade in early afternoon."
          },
          {
            id: "stop-2-3",
            title: "Traditional Uji Matcha Tea Ceremony",
            time: "02:30 PM",
            durationMinutes: 60,
            category: "Food",
            description: "Participate in an authentic Chanoyu tea ritual with artisan wagashi sweets guided by a tea master.",
            costEstimate: 35,
            location: "Kamigyo Ward",
            tips: "Wear socks that look clean as you take shoes off before entering the tatami tearoom."
          },
          {
            id: "stop-2-4",
            title: "Pontocho Alley Izakaya Dinner",
            time: "07:00 PM",
            durationMinutes: 120,
            category: "Nightlife",
            description: "Cozy riverside dining on kamo-gawa terraces with yakitori, seasonal sashimi, and local Kyoto craft beers.",
            costEstimate: 55,
            location: "Pontocho, Nakagyo Ward",
            tips: "Look for small red paper lanterns indicating counter seats available."
          }
        ]
      },
      {
        dayNumber: 3,
        dateOrDay: "Day 3",
        theme: "Tokyo Shinjuku Energy & Skyline Farewell",
        stops: [
          {
            id: "stop-3-1",
            title: "Shinkansen Bullet Train to Tokyo",
            time: "09:00 AM",
            durationMinutes: 135,
            category: "Transit",
            description: "High-speed rail zooming past Mount Fuji at 285 km/h while enjoying an Ekiben station bento box.",
            costEstimate: 95,
            location: "Kyoto Station -> Tokyo Station",
            tips: "Reserve seats on the right side (Seats D/E) going north for Mount Fuji views."
          },
          {
            id: "stop-3-2",
            title: "Shibuya Crossing & Hachiko Memorial",
            time: "01:30 PM",
            durationMinutes: 75,
            category: "Sightseeing",
            description: "Experience the pulse of the world's busiest pedestrian intersection with up to 3,000 people per green light.",
            costEstimate: 0,
            location: "Shibuya, Tokyo",
            tips: "Head up to the Shibuya Sky rooftop observatory for 360-degree glass panoramas."
          },
          {
            id: "stop-3-3",
            title: "Omoide Yokocho (Memory Lane) Farewell Dinner",
            time: "06:30 PM",
            durationMinutes: 90,
            category: "Food",
            description: "Atmospheric showa-era smoke alleyway serving charcoal-grilled skewers and ice-cold highballs.",
            costEstimate: 40,
            location: "Nishi-Shinjuku, Tokyo",
            tips: "Cash is king here; carry 1,000 yen notes for small plate ordering."
          }
        ]
      }
    ]
  },
  paris: {
    tripTitle: "Parisian Artistry, Cafes & Seine Secrets",
    destination: "Paris, France",
    durationDays: 3,
    summary: "From morning croissants in Montmartre to sunset river cruises and intimate bistro dining in Le Marais.",
    tripStyle: "Cultural & Romantic",
    estimatedTotalBudget: {
      currency: "EUR",
      amount: 980,
      breakdown: {
        activities: 220,
        food: 380,
        stay: 300,
        transport: 80
      }
    },
    packingHighlights: [
      "Comfortable stylish sneakers",
      "Crossbody bag with secure zipper",
      "Light trench coat",
      "Universal plug adapter"
    ],
    localTips: [
      "Always greet shopkeepers with 'Bonjour Madame/Monsieur' when walking into any store",
      "Book Louvre and Orsay tickets at least 2 weeks in advance",
      "Avoid sit-down cafes right on tourist plazas; step one block into side streets for double the quality"
    ],
    days: [
      {
        dayNumber: 1,
        dateOrDay: "Day 1",
        theme: "Montmartre Bohemian Vibe & Sacré-Cœur",
        stops: [
          {
            id: "stop-p-1",
            title: "Fresh Croissant & Espresso at Le Grenier à Pain",
            time: "08:30 AM",
            durationMinutes: 45,
            category: "Food",
            description: "Award-winning traditional baguette and flaky butter croissants in the heart of Montmartre.",
            costEstimate: 8,
            location: "Rue des Abbesses, 18th Arr.",
            tips: "Arrive right as pastries come warm out of the ovens."
          },
          {
            id: "stop-p-2",
            title: "Sacré-Cœur Basilica & Panoramic Viewpoint",
            time: "09:45 AM",
            durationMinutes: 90,
            category: "Sightseeing",
            description: "Travertine stone basilica at the highest point of Paris overlooking the sea of zinc rooftops.",
            costEstimate: 0,
            location: "Montmartre Hill",
            tips: "Climb the 300 dome steps for the best unobstructed view in northern Paris."
          },
          {
            id: "stop-p-3",
            title: "Place du Tertre Artists Square",
            time: "11:45 AM",
            durationMinutes: 60,
            category: "Culture",
            description: "Watch local painters and portrait artists working at outdoor easels in this historic cobblestone square.",
            costEstimate: 0,
            location: "Place du Tertre",
            tips: "Bargain politely if ordering a live portrait sketch."
          },
          {
            id: "stop-p-4",
            title: "Classic Bistro Dinner at Bouillon Pigalle",
            time: "07:00 PM",
            durationMinutes: 105,
            category: "Food",
            description: "Incredible value French cuisine: escargots, beef bourguignon, and giant profiteroles with warm chocolate.",
            costEstimate: 32,
            location: "Boulevard de Clichy",
            tips: "Line forms by 6:45 PM; queue early or reserve online to skip the wait."
          }
        ]
      },
      {
        dayNumber: 2,
        dateOrDay: "Day 2",
        theme: "Impressionist Masterpieces & Seine Sunset",
        stops: [
          {
            id: "stop-p-5",
            title: "Musée d'Orsay Railway Hall & Monets",
            time: "09:30 AM",
            durationMinutes: 150,
            category: "Culture",
            description: "Former grand beaux-arts railway station housing the world's largest collection of impressionist art.",
            costEstimate: 22,
            location: "1 Rue de la Légion d'Honneur",
            tips: "Walk through the giant clock face on the top floor for silhouette photos."
          },
          {
            id: "stop-p-6",
            title: "Jardin des Tuileries Picnic & Stroll",
            time: "01:00 PM",
            durationMinutes: 75,
            category: "Relaxation",
            description: "Grab quiche and macaron from nearby artisan bakeries and lounge in the famous green chairs by the grand basin.",
            costEstimate: 16,
            location: "Between Louvre & Place de la Concorde",
            tips: "Claim an inclined green metal chair in the shade under the lime trees."
          },
          {
            id: "stop-p-7",
            title: "Seine River Vedettes du Pont Neuf Cruise",
            time: "06:15 PM",
            durationMinutes: 65,
            category: "Sightseeing",
            description: "Open-deck cruise gliding under Paris' oldest stone bridges as golden hour illuminates Notre Dame and the Eiffel Tower.",
            costEstimate: 19,
            location: "Pont Neuf boarding dock",
            tips: "Time the cruise 30 minutes before sunset to catch both day and illuminated night perspectives."
          }
        ]
      },
      {
        dayNumber: 3,
        dateOrDay: "Day 3",
        theme: "Marais Boutiques, Falafel & Hidden Courtyards",
        stops: [
          {
            id: "stop-p-8",
            title: "Place des Vosges & Victor Hugo House",
            time: "10:00 AM",
            durationMinutes: 80,
            category: "Culture",
            description: "Oldest planned square in Paris surrounded by symmetrical red brick facades and vaulted arcades.",
            costEstimate: 0,
            location: "Le Marais, 4th Arr.",
            tips: "Sit on the lawn under the central fountains to people-watch."
          },
          {
            id: "stop-p-9",
            title: "L'As du Fallafel on Rue des Rosiers",
            time: "12:30 PM",
            durationMinutes: 45,
            category: "Food",
            description: "Legendary pita stuffed with crunchy fried falafel, grilled eggplant, tahini, and spicy red cabbage.",
            costEstimate: 12,
            location: "Rue des Rosiers",
            tips: "Order from the takeaway window and eat at the nearby garden square Jardin des Rosiers."
          },
          {
            id: "stop-p-10",
            title: "Eiffel Tower Twinkle Lights from Trocadéro",
            time: "08:30 PM",
            durationMinutes: 90,
            category: "Nightlife",
            description: "Watch the Iron Lady illuminate and sparkle with five minutes of dazzling golden strobes on the hour.",
            costEstimate: 0,
            location: "Place du Trocadéro",
            tips: "The first sparkle occurs as dusk falls, repeating every hour until midnight."
          }
        ]
      }
    ]
  }
};

/**
 * Returns a fallback mock trip matching the prompt or default
 */
export function getMockTrip(prompt = '') {
  const p = prompt.toLowerCase();
  if (p.includes('paris') || p.includes('france') || p.includes('europe')) {
    return JSON.parse(JSON.stringify(MOCK_TRIPS.paris));
  }
  // Default to Tokyo/Kyoto
  return JSON.parse(JSON.stringify(MOCK_TRIPS.tokyo));
}
