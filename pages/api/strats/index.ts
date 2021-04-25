import { getAllStrats, GetAllStrats } from '../../../models/strat'

// Format the response to match the old python-based API response
export function formatStrats(strats: GetAllStrats) {
    return {
        strats: strats.map(s => ({
            area_name: s.area.name,
            category_name: s.category.name,
            created_on: s.createdOn,
            description: s.description,
            difficulty: s.difficulty,
            game_name: "Super Metroid",
            id: s.id,
            link: s.link,
            name: s.name,
            room_name: s.room.name,
            user_name: s.user.username
        }))
    }
}

export default async (req, res) => {
    const json = JSON.stringify(formatStrats(await getAllStrats()), null, 2);
    return res.status(200).send(json);
}
