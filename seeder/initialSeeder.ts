import 'dotenv/config'
import {LocationModel} from "../models/Location";
import {connect} from "../src/database";
import {AttractionType} from "piarch-a-interfaces";

connect().then(async () => {
    await LocationModel.deleteMany({})
    await LocationModel.insertMany(
        [
            {
                "countryName": "Turkey",
                "availability": 1,
                "cities": [
                    {
                        "name": "Istanbul",
                        "availability": 1,
                        "coordinates": [
                            {
                                "name": "The Hagia Sophia",
                                "x": 41.008545,
                                "y": 28.9770532,
                                "type": AttractionType.Church,
                                "description": {
                                    en: "The Hagia Sophia is a breathtaking architectural masterpiece that has stood the test of time. Originally built as a cathedral in the 6th century, it was later converted into a mosque and is now a museum. Visitors can marvel at the stunning interior, with its soaring domes, elaborate mosaics, and grand marble pillars. The Hagia Sophia is a symbol of Istanbul\'s rich history and a must-see for any visitor to the city. Its grandeur and beauty are truly breathtaking and will leave a lasting impression on all who visit."
                                }
                            },
                            {
                                "name": "Blue Mosque",
                                "x": 41.00544,
                                "y": 28.97835,
                                "type": AttractionType.Mosque,
                                "description": {en: "The Blue Mosque, also known as the Sultan Ahmed Mosque, is a stunning architectural masterpiece that is one of the most iconic landmarks in Istanbul. With its elegant domes, towering minarets, and intricate blue tile work, it is a sight to behold. As you approach the mosque, you will be awestruck by its grandeur and beauty. The interior of the mosque is just as breathtaking, with its soaring ceilings, intricate carvings, and beautiful mosaics"}
                            },
                            {
                                "name": "Grand Bazaar",
                                "description": {en: "The Grand Bazaar is one of the largest and oldest covered markets in the world, and it is a popular tourist destination in Istanbul. As you walk through the bustling corridors of the bazaar, you will be immersed in the sights, sounds, and smells of Turkish culture. The market is filled with stalls selling everything from handmade crafts and souvenirs to fresh produce and local spices. You can haggle with the friendly shopkeepers and try your hand at bargaining for a good deal. The Grand Bazaar is more than just a place to shop – it is a place to experience the vibrant culture of Istanbul and immerse yourself in its rich history. Whether you are looking for unique gifts or just want to soak up the atmosphere, the Grand Bazaar is the perfect place to do it."},
                                "type": AttractionType.Shop,
                                "x": 41.01134,
                                "y": 28.95531
                            },
                            {
                                "name": "Basilica Cistern",
                                "description": {en: "The Basilica Cistern is a large underground chamber that was built in the 6th century to store water for the city of Constantinople, which is now Istanbul. The cistern was built to provide a reliable source of water for the city, which was often threatened by droughts and water shortages. It is located near the Hagia Sophia and was connected to the church by a series of aqueducts. The cistern is an impressive feat of engineering and is supported by 336 marble columns arranged in 12 rows. The columns are adorned with intricate carvings and decorated with ornate capitals. The cistern is also home to two small Medusa head sculptures, which are believed to have been used as bases for the columns. In the 16th century, the cistern was used as a place of confinement for prisoners, and it was later used as a warehouse. It was rediscovered in the 19th century and was restored and opened to the public as a museum in the 20th century."},
                                "type": AttractionType.Cistern,
                                "x": 41.00852,
                                "y": 28.97756
                            },
                            {
                                "name": "Cemberlitas Column",
                                "description": {en: "The Cemberlitas Column, also known as the Column of Constantine or the Burnt Column, is an ancient Roman column located in Istanbul, Turkey. It is made of marble and stands about 30 meters (98 feet) tall. The column is decorated with reliefs and inscriptions and is one of the few surviving ancient monuments in Istanbul.The column is believed to date back to the 4th century and was originally located in the Forum of Constantine in Constantinople, the ancient city that is now Istanbul. It was later moved to its current location in the Cemberlitas neighborhood. The column is named after the Turkish word \"cember,\" which means \"hoop,\" because it is surrounded by a circular platform."},
                                "type": AttractionType.Column,
                                "x": 41.01309,
                                "y": 28.97915
                            }
                        ],
                        "tours": [
                            {
                                "name": "Historical Tour",
                                "type": "Hike",
                                "shortDescription": "Amazing tour"
                            },
                            {
                                "name": "Detailed amazing tour",
                                "type": "Bike",
                                "shortDescription": "even longer and more amazing tour"
                            },
                            {
                                "name": "Bicycle tour",
                                "type": "Trekking",
                                "shortDescription": "small bike tour "
                            }
                        ]
                    },
                    {
                        "name": "Bursa",
                        "availability": 0
                    }
                ]
            },
            {
                "countryName": "Spain",
                "availability": 1,
                "cities": [
                    {
                        "name": "Barcelona",
                        "availability": 1,
                        "coordinates": [
                            {
                                "name": "Sagrada Familia",
                                "x": 41.4036,
                                "y": 2.1744,
                                "type": AttractionType.Church,
                                "description": {
                                    en: "The Sagrada Família is a large Roman Catholic basilica in Barcelona, Spain, designed by Catalan architect Antoni Gaudí. Construction on the Sagrada Família began in 1882 and is expected to be completed in 2026, the centenary of Gaudí's death. The basilica is a UNESCO World Heritage Site and is one of the most visited landmarks in Spain.Gaudí's designs for the Sagrada Família were unusual for the time, and the basilica incorporates a number of innovative architectural features. Gaudí drew inspiration from nature, and the basilica's design includes elements such as trees, vines, and animals. The Sagrada Família is also notable for its use of color and light, with stained glass windows and intricate carvings throughout the interior. Gaudí worked on the Sagrada Família for over 40 years, but he died in 1926 before the basilica was completed. Construction on the Sagrada Família has continued, and a number of architects have contributed to the project over the years. The basilica is currently in the final stages of construction and is expected to be completed in 2026"
                                }
                            },
                            {
                                "name": "Parc Güell",
                                "x": 41.4108,
                                "y": 2.1564,
                                "type": AttractionType.Park,
                                "description": {
                                    en: "Parc Güell is a public park located in Barcelona, Spain, designed by Antoni Gaudí. It is a UNESCO World Heritage Site and is known for its mosaicked buildings and sculptures. The park is located on Carmel Hill and offers panoramic views of the city. Parc Güell was originally intended to be a residential development, but the project was never completed. Gaudí designed the park as a garden city, with open spaces and winding paths surrounded by colorful mosaicked buildings and sculptures. The park features a number of iconic Gaudí works, including the Dragon Staircase and the Hypostyle Room, both of which are adorned with intricate mosaics."
                                }
                            },
                            {
                                "name": "Plaça de Catalunya",
                                "description": {en: "Plaça de Catalunya is a large square located in the center of Barcelona, Spain. It is a major transportation hub and a popular meeting place in the city, as it is surrounded by a number of major streets and is served by several metro lines. The square is a hub for both local and regional transportation, with bus and train stations located nearby."},
                                "type": AttractionType.Square,
                                "x": 41.3874,
                                "y": 2.1686
                            },
                            {
                                "description": {en: "Palau Güell is a mansion designed by the architect Antoni Gaudí in Barcelona, Spain. It was built between 1886 and 1888 for the industrial tycoon Eusebi Güell, who was a patron of Gaudí's work. The building is considered an early example of Gaudí's innovative use of undulating organic forms and is a UNESCO World Heritage Site. The mansion is open to the public and features a variety of spaces, including a grand hall, a library, and a roof terrace with views of the city. Palau Güell is considered a masterpiece of Catalan modernism and is a popular tourist attraction in Barcelona."},
                                "name": "Palau Güell",
                                "x": 41.3776,
                                "y": 2.176,
                                "type": AttractionType.House
                            },
                            {
                                "name": "Casa Batlló",
                                "x": 41.3916,
                                "y": 2.1628,
                                "type": AttractionType.House,
                                "description": {
                                    en: "Casa Batlló is a modernist building in Barcelona, Spain, designed by Antoni Gaudí. It is located at Passeig de Gracia 43 in the Eixample district of Barcelona. The building was constructed between 1904 and 1906 and is considered one of Gaudí's most iconic works. It is known for its unique, undulating facade and its use of colorful mosaics and tiles. The building is open to the public and offers tours of its interior, which features a variety of ornately decorated spaces, including a grand hall, a rooftop terrace, and a museum dedicated to Gaudí's life and work."
                                }
                            }
                        ],
                        "tours": [
                            {
                                "name": "Historical Tour",
                                "type": "Hike",
                                "shortDescription": "Amazing tour"
                            },
                            {
                                "name": "Detailed amazing tour",
                                "type": "Bike",
                                "shortDescription": "even longer and more amazing tour"
                            },
                            {
                                "name": "Bicycle tour",
                                "type": "Trekking",
                                "shortDescription": "small bike tour "
                            }
                        ]
                    }
                ]
            },
            {

                "countryName": "Cuba",
                "availability": 1,
                "cities": [
                    {

                        "name": "Havana",
                        "availability": 1,
                        "coordinates": [
                            {
                                "name": "Plaza de la Catedral",
                                "x": 23.1378,
                                "y": 82.3486,
                                "description": {en:"Plaza de la Catedral, also known as Cathedral Square, is a captivating public space nestled in the heart of Old Havana, a UNESCO World Heritage site. The square is dominated by the stunning Havana Cathedral (Catedral de la Habana), a masterpiece of Cuban Baroque architecture. The cathedral, dedicated to the Virgin Mary, was constructed in the 18th century and features a beautiful facade, intricate stonework, and a peaceful courtyard.\nSurrounding the square are well-preserved colonial buildings with colorful facades, wrought-iron balconies, and classic Spanish architectural elements. These buildings house various shops, restaurants, and cafes, adding to the lively atmosphere of the plaza.Plaza de la Catedral serves as a focal point for both locals and visitors, offering a picturesque setting for leisurely walks, people-watching, and cultural experiences. The ambiance is enhanced by the sounds of live music that often fills the air, as talented musicians and performers gather to entertain passersby.Key attractions within or near the square include the Palacio de los Marqueses de Aguas Claras, a colonial mansion turned museum, and the Palacio del Conde Lombillo. The entire area exudes a sense of history and nostalgia, transporting visitors back in time to Havana's colonial era."},
                                "type": 9
                            },
                            {

                                "name": "Palacio de los Marqueses de Aguas Claras",
                                "x": 23.138,
                                "y": -82.3487,
                                "description": {en : "The palace, like other colonial structures, may feature an elegant facade with intricate stonework, ornate balconies, and large wooden doors. Inside, you might find well-preserved rooms showcasing the opulence of the colonial period, including grand halls, courtyards, and beautiful gardens.It's common for these palaces to house museums that exhibit artifacts and artworks, providing visitors with a glimpse into the history and lifestyle of the aristocracy during colonial times. Some palaces also function as boutique hotels, offering guests a unique and historically rich accommodation experience."},
                                "type": 8
                            },
                            {
                                "name": "El Capitolio",
                                "x": 23.1362,
                                "y": -82.3597,
                                "description": {en: "El Capitolio, or the National Capitol Building (Capitolio Nacional), is a iconic landmark located in the heart of Havana, Cuba. Built in the 1920s and completed in 1929, it served as the seat of government until the Cuban Revolution in 1959. The building's architecture is neoclassical and bears a striking resemblance to the United States Capitol in Washington, D.C., with a notable dome crowning its structure. El Capitolio stands as a testament to Cuba's historical ties with the United States."},
                                "type": 8
                            },
                            {

                                "name": "Plaza de Armas",
                                "x": 23.1392,
                                "y": -82.3509,
                                "description": {en:"Surrounded by historic buildings with colorful facades and wrought-iron balconies, Plaza de Armas exudes colonial elegance. The architecture reflects a mix of Spanish and Moorish influences, creating a captivating atmosphere that transports visitors back in time.The square is adorned with palm trees and well-maintained gardens, providing a serene and inviting environment. The lush greenery and open space offer a pleasant contrast to the surrounding historic structures."},
                                "type": 9
                            },
                            {
                                "name": "Castillo de la Real Fuerza",
                                "x": 23.1382,
                                "y": -82.35,
                                "description": {en:"Built in the 16th century, Castillo de la Real Fuerza is an excellent example of military architecture from the colonial era. The fortress was designed by the Italian engineer Juan Bautista Antonelli. Its structure combines elements of medieval European fortresses with adaptations to the tropical environment.The fortress features thick stone walls, bastions, and a prominent watchtower. One of its distinctive architectural elements is the Giraldilla, a weathervane shaped like a female figure that adorns the tower. This iconic symbol is one of the most recognizable features of the castle.Castillo de la Real Fuerza has a rich history closely tied to the early colonial period of Cuba. It was constructed to defend the city against pirate attacks and served as the residence of the Spanish captains general. Over the centuries, it has been used for various purposes, including as a residence, a prison, and an observatory."},
                                "type": 11
                            }
                        ],
                        "tours": []
                    }
                ],
                "__v": 0
            },
            {
                "countryName": "Qatar",
                "availability": 1,
                "cities": [
                    {
                        "name": "Doha",
                        "availability": 1,
                        "coordinates": [
                            {
                                "name": "The Museum of Islamic Art",
                                "x": 25.2877,
                                "y": 51.5268,
                                description: {en: "The Museum of Islamic Art in Doha, Qatar, is a cultural landmark renowned for its stunning architecture and extensive collection of Islamic art spanning over 1,400 years. Located on the Corniche waterfront, this architectural masterpiece houses a diverse range of artifacts including calligraphy, ceramics, textiles, and metalwork. Designed by the renowned architect I. M. Pei, the museum offers visitors a unique opportunity to explore the rich cultural heritage of the Islamic world."},
                                "type": AttractionType.Museum
                            },
                            {
                                "name": "Souq Waqif",
                                "x": 25.2874,
                                "y": 51.5334,
                                "type": AttractionType.Shop,
                                description: {en: "Souq Waqif is a bustling traditional market located in the heart of Doha, Qatar. Its narrow alleyways are filled with shops selling a wide array of goods including spices, perfumes, fabrics, handicrafts, and traditional garments. Visitors can immerse themselves in the vibrant atmosphere and experience the sights, sounds, and smells of traditional Qatari life. The souq also features numerous restaurants and cafes serving authentic Qatari cuisine, making it a popular destination for locals and tourists alike."}
                            },
                            {
                                "name": "The Pearl-Qatar",
                                "x": 25.3756,
                                "y": 51.5415,
                                "type": AttractionType.Park,
                                description: {en: "The Pearl-Qatar is a luxurious man-made island located off the coast of Doha, Qatar. It is known for its stunning architecture, upscale residential areas, and vibrant waterfront promenades. The island features high-end boutiques, fine dining restaurants, and a marina, offering visitors a unique blend of luxury living and leisure activities. With its beautiful views and bustling atmosphere, The Pearl-Qatar is a popular destination for shopping, dining, and leisurely strolls along the waterfront."}
                            },
                            {
                                "name": "Katara Cultural Village",
                                "x": 25.3685,
                                "y": 51.5341,
                                type: AttractionType.Square,
                                description: {en: "Katara Cultural Village is a cultural complex located on the eastern coast of Doha, Qatar. Spread across 1,000,000 square meters, it showcases Qatar's rich cultural heritage and hosts various events and exhibitions throughout the year. The village features a theater, art galleries, an opera house, a mosque, a beach, and numerous restaurants serving international cuisine. Visitors can immerse themselves in traditional music, dance performances, art installations, and film festivals, making it a hub for arts and culture in Doha."}
                            },
                            {
                                "name": "Aspire Park",
                                "x": 25.2812,
                                "y": 51.4436,
                                type: AttractionType.Park,
                                description: {en: "Aspire Park is the largest public park in Doha, Qatar, spanning over 88 hectares. Located near the Aspire Zone, it offers a tranquil escape from the hustle and bustle of the city. The park features lush green landscapes, walking paths, playgrounds, and a large lake, providing plenty of opportunities for outdoor recreation and relaxation. Visitors can enjoy picnics, jogging, cycling, or simply taking in the serene surroundings. With its beautiful scenery and recreational facilities, Aspire Park is a popular destination for families, joggers, and nature lovers alike."}
                            }
                        ]
                    }
                ]
            }
        ]
    )
}).then(async () => {
    const a = await LocationModel.findOne({})
    console.log(JSON.stringify(a))
    process.exit(0)
})
