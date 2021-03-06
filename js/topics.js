/**
 * Created by Porter on 8/12/2017.
 */

var topics = [
    "Fire",
    "Water",
    "Crime",
    "Bacon",
    "Ugly",
    "Fast",
    "Slow",
    "Women",
    "Men",
    "Gay",
    "Hotels",
    "Rental Car",
    "Help",
    "Suicide",
    "Trump",
    "War",
    "Money",
    "Tax",
    "Futbol",
    "Football",
    "Soccer",
    "Hamburger",
    "McDonalds",
    "Immigration",
    "Subway",
    "Lice",
    "Zika",
    "Malaria",
    "Murder",
    "Guns",
    "Obesity",
    "Pokemon",
    "Pikachu",
    "Minecraft",
    "Roblox",
    "Runescape",
    "World of Warcraft",
    "PS4",
    "Xbox",
    "Mosquito",
    "Marvel",
    "Food",
    "Porn",
    "Islam",
    "Christianity",
    "Jesus",
    "Satan",
    "Religion",
    "Atheism",
    "Heavy Metal",
    "Metallica",
    "Taylor Swift",
    "Justin Bieber",
    "Iron Maiden",
    "Pop Music",
    "K-pop",
    "Hollywood",
    "Bollywood",
    "Whiskey",
    "Rum",
    "Beer",
    "Nightclub",
    "Disco",
    "Party",
    "Drugs",
    "Cocaine",
    "Meth",
    "Alcohol",
    "Heroine",
    "Marijuana",
    "Butts",
    "Boobs",
    "Harry Potter",
    "Legos",
    "Disney",
    "Mickey Mouse",
    "Tinkerbell",
    "NBA",
    "Hockey",
    "Basketball",
    "Golf",
    "Tennis",
    "Badminton",
    "Cricket",
    "Dragonball",
    "Anime",
    "Manga",
    "Crossfit",
    "Olympics",
    "FIFA",
    "World Cup",
    "Messi",
    "Ronaldo",
    "Ronaldinho",
    "Neymar",
    "Lebron James",
    "Michael Jordan",
    "Steph Curry",
    "James Harden",
    "Kim Kardashian",
    "Keeping Up With The Kardashians",
    "Ozzy Osbourne",
    "Simon Cowell",
    "50 Shades of Grey",
    "Video Games",
    "Reddit",
    "Netflix",
    "Netflix and Chill",
    "Sonic the Hedgehog",
    "Mario",
    "Nintendo",
    "Zelda",
    "Queen Elizabeth",
    "Devil",
    "Bible",
    "Koran",
    "Mosque",
    "Temple",
    "Jew",
    "Rasicm",
    "Police",
    "Hitman",
    "Prostitute",
    "Children",
    "Daycare",
    "Vacation",
    "Beach",
    "Cars",
    "Youtube",
    "Google",
    "Yahoo",
    "Amazon",
    "eBay",
    "iPhone",
    "Apple",
    "Android",
    "Hot",
    "Weather",
    "Hurricane",
    "Rain",
    "Snow",
    "Volcano",
    "Earthquake",
    "KFC",
    "Boner",
    "Horny",
    "Depressed",
    "Vegan",
    "Vegetarian",
    "Donuts",
    "Ice Cream"
];


var landmarks = [
    {
        name: "The Statue of Liberty",
        image: "/images/landmarks/statue_of_liberty.jpg",
        iso: 'US',
        country: "United States"
    },
    {name: "The Eiffel Tower", image: "/images/landmarks/eiffel_tower.jpg", iso: 'FR', country: "France"},
    {name: "St. Basil's Cathedral", image: "/images/landmarks/eiffel_tower.jpg", iso: 'RU', country: "Russia"},
    {name: "Blue Domed Church", image: "/images/landmarks/blue_domed_church.jpg", iso: 'GR', country: "Greece"},
    {name: "The Great Sphinx", image: "/images/landmarks/great_sphynx.jpg", iso: 'EG', country: "Egypt"},
    {name: "The Pyramids", image: "/images/landmarks/pyramids.jpg", iso: 'EG'},
    {name: "The Little Mermaid", image: "/images/landmarks/the_little_mermaid.jpg", iso: 'DK'},
    {name: "Neptune & The Palace of Versailles", image: "/images/landmarks/neptune.jpg", iso: 'FR', country: "France"},
    {name: "Windmills", image: "/images/landmarks/windmills.jpg", iso: 'NL', country: "The Netherlands"},
    {name: "The Great Wall", image: "/images/landmarks/great_wall.jpg", iso: 'CN', country: "China"},
    {name: "The Taj Mahal", image: "/images/landmarks/taj_mahal.jpg", iso: 'IN', country: "India"},
    {name: "Machu Picchu", image: "/images/landmarks/machu_picchu.png", iso: 'PE', country: "Peru"},
    {name: "Big Ben", image: "/images/landmarks/big_ben.jpg", iso: 'GB', country: "United Kingdom"},
    {name: "The Burj al Arab", image: "/images/landmarks/burj_al_arab.jpg", iso: 'AE', country: "UAE"},
    {name: "Tower of Pisa", image: "/images/landmarks/tower_of_pisa.jpg", iso: 'IT', country: "Italy"},
    {name: "Christ the Redeemer", image: "/images/landmarks/christ_the_redeemer.jpg", iso: 'BR', country: "Brazil"},
    {name: "Lascaux", image: "/images/landmarks/lascaux.jpg", iso: 'FR', country: "France"},
    {name: "Mecca", image: "/images/landmarks/mecca.jpg", iso: 'SA', country: "Saudi Arabia"},
    {name: "Loch Ness", image: "/images/landmarks/loch_ness.jpg", iso: 'GB', country: "United Kingdom"},
    {name: "Mont St. Michel", image: "/images/landmarks/mont_st_michel.jpg", iso: 'FR', country: "France"},
    {name: "Bran Castle", image: "/images/landmarks/bran_castle.jpg", iso: 'RO', country: "Romania"},
    {name: "Hagia Sophia", image: "/images/landmarks/agia_sophia.jpg", iso: 'TR', country: "Turkey"},
    {name: "Brandenburg Gate", image: "/images/landmarks/brandenburg_gate.jpg", iso: 'DE', country: "Germany"},
    {name: "Acropolis", image: "/images/landmarks/acropolis.jpg", iso: 'GR', country: "Greece"},
    {name: "Sagrada Familia", image: "/images/landmarks/sagrada_familia.jpg", iso: 'ES', country: "Spain"},
    {name: "Uluru", image: "/images/landmarks/uluru.jpg", iso: 'AU', country: "Australia"},
    {name: "Neuschwanstein", image: "/images/landmarks/neuschwanstein.jpg", iso: 'DE', country: "Germany"},
    {name: "Mount Fuji", image: "/images/landmarks/mt_fuji.jpg", iso: 'JP', country: "Japan"},
    {name: "Stonehenge", image: "/images/landmarks/stonehenge.jpg", iso: 'GB', country: "United Kingdom"},
    {name: "Mount Eden Crater", image: "/images/landmarks/mount_eden_crater.jpg", iso: 'NZ', country: "New Zealand"},
    {name: "Easter Island", image: "/images/landmarks/easter_island.jpg", iso: 'CL', country: "Chile"},
    {name: "Capitol Hill", image: "/images/landmarks/capitol_hill.jpg", iso: 'US', country: "United States"},
    {name: "Al Aqsa Mosque", image: "/images/landmarks/al_aqsa.jpg", iso: 'IL', country: "Israel"},

    {name: "Angkor Wat", image: "/images/landmarks/angkor_wat.jpg", iso: 'KH', country: "Cambodia"},
    {name: "Manneken Pis", image: "/images/landmarks/manneken_pis.jpg", iso: 'BE', country: "Belgium"},

    {
        name: "St. Peter's Cathedral",
        image: "/images/landmarks/st_peters_cathedral.jpg",
        iso: 'VA',
        country: "Vatican City"
    },
    {name: "Mount Rushmore", image: "/images/landmarks/mount_rushmore.jpg", iso: 'US', country: "United States"},
    {name: "Victoria Falls", image: "/images/landmarks/victoria_falls.jpg", iso: 'ZM', country: "Zambia"},
    {name: "The Grand Canyon", image: "/images/landmarks/the_grand_canyon.jpg", iso: 'US', country: "United States"},
    {name: "Nevada Mismi", image: "/images/landmarks/nevado_mismi.jpg", iso: 'PE', country: "Peru"},
    {name: "Great Buddha", image: "/images/landmarks/great_buddha.jpg", iso: 'JP', country: "Japan"},
    {name: "Petra", image: "/images/landmarks/petra.jpg", iso: 'JO', country: "Jordan"},
    {name: "Trevi Fountain", image: "/images/landmarks/trevi_fountain.jpg", iso: 'IT', country: "Italy"},
    {name: "Auschwitz", image: "/images/landmarks/auschwitz.jpg", iso: 'PL', country: "Poland"},
    {name: "Cape of Hood Hope", image: "/images/landmarks/cape_of_good_hope.jpg", iso: 'ZA', country: "South Africa"},
    {name: "North Cape", image: "/images/landmarks/north_cape.jpg", iso: 'NO', country: "Norway"},
    {name: "Chichen Itza", image: "/images/landmarks/chichen_itza.jpg", iso: 'MX', country: "MX"},
    {name: "Inukshuk", image: "/images/landmarks/inukshuk.jpg", iso: 'CA', country: "Canada"},
    {name: "Table Mountain", image: "/images/landmarks/table_mountain.jpg", iso: 'ZA', country: "South Africa"},
    {
        name: "Golden Gate Bridge",
        image: "/images/landmarks/golden_gate_bridge.jpg",
        iso: 'US',
        country: "United States"
    },
    {name: "Opera House", image: "/images/landmarks/opera_house.jpg", iso: 'AU', country: "Australia"},
    {name: "Parc Guell", image: "/images/landmarks/parc_guell.jpg", iso: 'ES', country: "Spain"},
    {name: "Kilimanjaro", image: "/images/landmarks/kilimanjaro.jpg", iso: 'TZ', country: "Tanzania"},
    {name: "Forbidden City", image: "/images/landmarks/forbidden_city.jpg", iso: 'CN', country: "China"},
    {name: "Iguazu Falls", image: "/images/landmarks/iguazu_falls.jpg", iso: 'BR', country: "Brazil"},
    {name: "The Colosseum", image: "/images/landmarks/colosseum.jpg", iso: 'IT', country: "Italy"},
    {name: "Twyfelfontein", image: "/images/landmarks/twyfelfontein.jpg", iso: 'NA', country: "Namibia"},
    {name: "Tower Bridge", image: "/images/landmarks/tower_bridge.jpg", iso: 'GB', country: "United Kingdom"},
    {name: "The Blue Mosque", image: "/images/landmarks/the_blue_mosque.jpg", iso: 'TR', country: "Turkey"},
    {name: "The Sphinx", image: "/images/landmarks/sphynx.jpg", iso: 'RO', country: "Romania"},
    {name: "Millau Bridge", image: "/images/landmarks/millau_bridge.jpg", iso: 'FR', country: "France"},
    {name: "Luxor Temple", image: "/images/landmarks/luxor_temple.jpg", iso: 'EG', country: "Egypt"},
    {name: "Dom", image: "/images/landmarks/dom.jpg", iso: 'DE', country: "Germany"},
    {name: "Faisal Mosque", image: "/images/landmarks/faisal_mosque.jpg", iso: 'PK', country: "Pakistan"},
    {name: "Kremlin", image: "/images/landmarks/kremlin.jpg", iso: 'RU', country: "Russia"},
    {
        name: "The Empire State Building",
        image: "/images/landmarks/empire_state_building.jpg",
        iso: 'US',
        country: "United States"
    },
    {name: "Hermitage", image: "/images/landmarks/hermitage.jpg", iso: 'RU', country: "Russia"},
    {name: "Newgrange", image: "/images/landmarks/newgrange.jpg", iso: 'IE', country: "Ireland"},
    {name: "Waterloo", image: "/images/landmarks/waterloo.jpg", iso: 'BE', country: "Belgium"},
    {name: "Carnac", image: "/images/landmarks/carnac.jpg", iso: 'FR', country: "France"},
    {name: "Temple of Besakih", image: "/images/landmarks/temple_of_besakih.jpg", iso: 'ID', country: "Indonesia"},
    {name: "Pompeii", image: "/images/landmarks/pompeii.jpg", iso: 'IT', country: "Italy"},
    {name: "The Wailing Wall", image: "/images/landmarks/wailing_wall.jpg", iso: 'IL', country: "Israel"},
    {name: "Konark Sun Temple", image: "/images/landmarks/konark_sun_temple.jpg", iso: 'IN', country: "India"},
    {name: "Abu Simbel", image: "/images/landmarks/abu_simbel.jpg", iso: 'EG', country: "Egypt"},
    {name: "Middle of the Earth", image: "/images/landmarks/middle_of_the_earth.jpg", iso: 'EC', country: "Ecuador"},
    {name: "The Prohpet's Mosque", image: "/images/landmarks/prophets_mosque.jpg", iso: 'SA', country: "Saudi Arabia"},
    {name: "Jin Mao & SWFC", image: "/images/landmarks/jin_mao_swfc.jpg", iso: 'CN', country: "China"},
    {name: "Sacre Coeur", image: "/images/landmarks/sacre_Coeur.jpg", iso: 'FR', country: "France"},
    {name: "American Cemetary", image: "/images/landmarks/american_cemetary.jpg", iso: 'FR', country: "France"},
    {name: "Potala Palace", image: "/images/landmarks/potala_palace.jpg", iso: 'CN', country: "China (Tibet)"},
    {name: "Skellig Michael", image: "/images/landmarks/skellig_michael.jpg", iso: 'IE', country: "Ireland"},
    {name: "Angel Falls", image: "/images/landmarks/angel_falls.jpg", iso: 'VE', country: "Venezuela"},
    {name: "The Louvre", image: "/images/landmarks/the_louvre.jpg", iso: 'FR', country: "France"},
    {name: "Atomium", image: "/images/landmarks/atomium.jpg", iso: 'BE', country: "Belgium"},
    {
        name: "White Cliffs of Dover",
        image: "/images/landmarks/white_cliffs_of_dover.jpg",
        iso: 'GB',
        country: "United Kingdom"
    },
    {name: "Minaret of Jam", image: "/images/landmarks/minaret_of_jame.jpg", iso: 'AF', country: "Afghanistan"},
    {
        name: "Golden Temple of Amritsar",
        image: "/images/landmarks/golden_temple_of_amritsar.jpg",
        iso: 'IN',
        country: "India"
    },
    {
        name: "The Palace of Parliament",
        image: "/images/landmarks/palace_of_parliament.jpg",
        iso: 'RO',
        country: "Romania"
    },
    {name: "Rock of Gibraltar", image: "/images/landmarks/rock_of_gibraltar.jpg", iso: 'GB', country: "United Kingdom"},
    {name: "Lotus Temple", image: "/images/landmarks/lotus_temple.jpg", iso: 'IN', country: "India"},
    {name: "Half Dome", image: "/images/landmarks/half_dome.jpg", iso: 'US', country: "United States"},
    {name: "CN Tower", image: "/images/landmarks/cn_tower.jpg", iso: 'CA', country: "Canada"},
    {name: "Hollywood Sign", image: "/images/landmarks/hollywood_sign.jpg", iso: 'US', country: "United States"},
    {name: "Ephesus", image: "/images/landmarks/ephesus.jpg", iso: 'TR', country: "Turkey"},
    {name: "Twelve Apostles", image: "/images/landmarks/twelve_apostles.jpg", iso: 'AU', country: "Australia"},
    {name: "Piazza San Marco", image: "/images/landmarks/piazza_san_marco.jpg", iso: 'IT', country: "Italy"},
    {name: "Vinson Massif", image: "/images/landmarks/vinson_massif.jpg", iso: 'AQ', country: "Antarctica"}
];

module.exports = {
    topics: topics,
    landmarks: landmarks,
    getTopics: function (array) {
        var items = [];

        while (items.length < 4) {
            var isDuplicate = false;
            var item = module.exports[array][Math.floor(Math.random() * module.exports[array].length)];
            for (var i = 0; i < items.length; i++) {
                if (array == "topics") {
                    if (items[i] == item) {
                        isDuplicate = true;
                        break;
                    }
                }
                else if (array == "landmarks") {
                    if (items[i].name == item.name) {
                        isDuplicate = true;
                        break;
                    }
                }
            }
            if (!isDuplicate) {
                items[i] = item;
            }
        }

        return items;
    },
    getLandmarkCounty: function (name) {
        var l = module.exports.landmarks;
        var match = null;
        for (var i = 0; i < l.length; i++) {
            if (name === l[i].name) {
                match = l[i].iso;
                break;
            }
        }
        return match;
    }
};