import { getAllStrats } from '../../../models/strat'
import { formatStrats } from './index'

export default async (req, res) => {
    const { search } = req.query;
    const searchText = (search as string).toLowerCase();
    const strats = await getAllStrats();
    const filteredStrats = strats.filter(s =>
        s.area.name.toLowerCase().includes(searchText) || 
        s.room.name.toLowerCase().includes(searchText) || 
        s.category.name.toLowerCase().includes(searchText) || 
        s.name.toLowerCase().includes(searchText) ||            
        s.description.toLowerCase().includes(searchText));

    const json = JSON.stringify(formatStrats(filteredStrats), null, 2);
    res.status(200).send(json);
}
