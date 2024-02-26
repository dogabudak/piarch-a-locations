import 'dotenv/config'
import {LocationModel} from "../models/Location";
import {AttractionType, Availability} from "piarch-a-interfaces";
import { connect } from "../src/database";
connect().then(()=>{
    LocationModel.create({
        countryName: 'Cuba',
        availability: Availability.available,
        cities: [{
            name: 'Havana',
            availability: Availability.available,
            coordinates: [{
                name: 'Plaza de la Catedral',
                x: 23.1378,
                y: -82.3486,
                description: 'Plaza de la Catedral, also known as Cathedral Square, is a captivating public space nestled in the heart of Old Havana, a UNESCO World Heritage site. The square is dominated by the stunning Havana Cathedral (Catedral de la Habana), a masterpiece of Cuban Baroque architecture. The cathedral, dedicated to the Virgin Mary, was constructed in the 18th century and features a beautiful facade, intricate stonework, and a peaceful courtyard.\n' +
                    'Surrounding the square are well-preserved colonial buildings with colorful facades, wrought-iron balconies, and classic Spanish architectural elements. These buildings house various shops, restaurants, and cafes, adding to the lively atmosphere of the plaza.' +
                    'Plaza de la Catedral serves as a focal point for both locals and visitors, offering a picturesque setting for leisurely walks, people-watching, and cultural experiences. The ambiance is enhanced by the sounds of live music that often fills the air, as talented musicians and performers gather to entertain passersby.' +
                    'Key attractions within or near the square include the Palacio de los Marqueses de Aguas Claras, a colonial mansion turned museum, and the Palacio del Conde Lombillo. The entire area exudes a sense of history and nostalgia, transporting visitors back in time to Havana\'s colonial era.',
                type: AttractionType.Square,
            }, {
                name: 'Palacio de los Marqueses de Aguas Claras',
                x: 23.1380,
                y: -82.3487,
                description: 'The palace, like other colonial structures, may feature an elegant facade with intricate stonework, ornate balconies, and large wooden doors. Inside, you might find well-preserved rooms showcasing the opulence of the colonial period, including grand halls, courtyards, and beautiful gardens.' +
                    'It\'s common for these palaces to house museums that exhibit artifacts and artworks, providing visitors with a glimpse into the history and lifestyle of the aristocracy during colonial times. Some palaces also function as boutique hotels, offering guests a unique and historically rich accommodation experience.',
                type: AttractionType.House,
            }, {
                name: 'El Capitolio',
                x:  23.1362,
                y: -82.3597,
                description:'El Capitolio, or the National Capitol Building (Capitolio Nacional), is a iconic landmark located in the heart of Havana, Cuba. Built in the 1920s and completed in 1929, it served as the seat of government until the Cuban Revolution in 1959. The building\'s architecture is neoclassical and bears a striking resemblance to the United States Capitol in Washington, D.C., with a notable dome crowning its structure. El Capitolio stands as a testament to Cuba\'s historical ties with the United States.',
                type: AttractionType.House,
            }, {
                name: 'Plaza de Armas',
                x:23.1392,
                y: -82.3509,
                description:'Surrounded by historic buildings with colorful facades and wrought-iron balconies, Plaza de Armas exudes colonial elegance. The architecture reflects a mix of Spanish and Moorish influences, creating a captivating atmosphere that transports visitors back in time.The square is adorned with palm trees and well-maintained gardens, providing a serene and inviting environment. The lush greenery and open space offer a pleasant contrast to the surrounding historic structures.',
                type: AttractionType.Square
            }, {
                name: 'Castillo de la Real Fuerza',
                x: 23.1382,
                y: -82.3500,
                description: 'Built in the 16th century, Castillo de la Real Fuerza is an excellent example of military architecture from the colonial era. The fortress was designed by the Italian engineer Juan Bautista Antonelli. Its structure combines elements of medieval European fortresses with adaptations to the tropical environment.' +
                    'The fortress features thick stone walls, bastions, and a prominent watchtower. One of its distinctive architectural elements is the Giraldilla, a weathervane shaped like a female figure that adorns the tower. This iconic symbol is one of the most recognizable features of the castle.' + 'Castillo de la Real Fuerza has a rich history closely tied to the early colonial period of Cuba. It was constructed to defend the city against pirate attacks and served as the residence of the Spanish captains general. Over the centuries, it has been used for various purposes, including as a residence, a prison, and an observatory.',
                type: AttractionType.Castle
            }]
        }],
    })

})
