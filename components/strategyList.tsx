import { Strat } from '@prisma/client'
import { Modal, Table, Button } from 'react-bootstrap'
import { Strategy } from './strategy'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetAllStrats } from '../models/strat'
import { orderBy } from 'lodash'
import { LoggedInUser } from '../lib/useUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faBan, faGlobeEurope } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

interface StrategyListProps
{
    initialStrats: GetAllStrats,
    user: LoggedInUser,
    searchText: string
}

interface SortField {
    field: string;
    order: "asc" | "desc";
}

interface FilterField {
    field: string;
    value: string;
}

interface DeleteDialogState {
    show: boolean;
    strat: Strat;
}

export function StrategyList({ initialStrats, user, searchText }: StrategyListProps) {
    const router = useRouter();
    const [strats, setStrats] = useState(initialStrats);
    const [stratState, setStratState] = useState({});
    const [sortField, setSortField] = useState<SortField>({ field: "area.name", order: "asc"});
    const [filterField, setFilterField] = useState<FilterField>();
    const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>({show: false, strat: null});
    const single = initialStrats.length === 1;

    const isStratVisible = (strat: Strat) => stratState[strat.id] === true;    

    const closeDeleteDialog = () => setDeleteDialogState({show: false, strat: null});
    const showDeleteDialog = (strat: Strat) => setDeleteDialogState({show: true, strat: strat});
    const deleteStrat = async (strat: Strat) => {
        if(strat) {
            try {
                const response = await fetch(`/api/strat/${strat.id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();
                
                if(result.status !== "ok") {
                    console.log(result);
                }

                if(single) {
                    router.push("/");
                } else {
                    setStrats(prevStrats => prevStrats.filter(s => s.id !== strat.id));
                }

            } catch (e) {
                console.log(e);
            }
            
        }

        closeDeleteDialog();
    }   

    const toggleStrat = (strat: Strat) => {
        setStratState((prev) => { 
            return {...prev, [strat.id]: !isStratVisible(strat) };
        });
    }
    
    const updateSortField = (field: string) => {
        setSortField({
            field: field,
            order: field === sortField.field 
                ? (sortField.order === "asc" ? "desc" : "asc")
                : "asc"
        })
    }

    const updateFilterField = (field: string, value: string) => {
        if(filterField && filterField.field === field) {
            setFilterField(null);
        } else {
            setFilterField({
                field: field,
                value: value
            })
        }
    }
    
    /* TODO: This should really be fixed in the database, but it's here for now */
    const fixRoomLink = (link: string) => {
        if(link.includes("deanyd")) {
            return "https://wiki.supermetroid.run/" + link.substring(link.indexOf("=") + 1);
        } else {
            return link;
        }
    }

    const SortIndicator = ({name, field}) => 
        <a href="#" onClick={() => updateSortField(field)}>{name} <span className="sortIndicator">{sortField.field === field && (sortField.order === "asc" ? "▼" : "▲")}</span></a>
    
    const FilterIndicator = ({name, field, id}) => {
        const filterClass = filterField 
            ? (filterField.field === field ? "filteredField" : "unfilteredField")
            : "unfilteredField";
        
        return (
            <a href="#" onClick={() => updateFilterField(field, id)} className={filterClass}>{name}</a>
        )
    }
        
    const DifficultyLabel = ({difficulty}) => {
        const [labelClass, labelName] = {
            1: ["success", "Beginner"],
            2: ["warning", "Intermediate"],
            3: ["danger", "Advanced"]
        }[difficulty];
        return <span className={`badge badge-${labelClass}`}>{labelName}</span>;
    }

    const searchedStrats = searchText && searchText.length > 1 
    ? strats.filter(s => 
        s.area.name.toLowerCase().includes(searchText) || 
        s.room.name.toLowerCase().includes(searchText) || 
        s.category.name.toLowerCase().includes(searchText) || 
        s.name.toLowerCase().includes(searchText) ||            
        s.description.toLowerCase().includes(searchText))
    : strats;

    const sortedStrats = orderBy(searchedStrats, [sortField.field, "area.name", "category.name", "room.name"], [sortField.order, "asc", "asc", "asc"]);
    const filteredStrats = filterField ? sortedStrats.filter(s => s[filterField.field] === filterField.value) : sortedStrats;

    return (
        <>
        <Table size="sm">
            <thead className="stratList">
                <tr>
                    <th><SortIndicator name="Area" field="area.name" /></th>
                    <th><SortIndicator name="Room" field="room.name" /></th>
                    <th><SortIndicator name="Category" field="category.name" /></th>
                    <th><SortIndicator name="Name" field="name" /></th>
                    <th><SortIndicator name="Difficulty" field="difficulty" /></th>
                    {single || <th style={{border: "none"}}>Info</th>}
                    {user && user.isLoggedIn && <th></th>}
                </tr>
            </thead>
                {filteredStrats.map((strat) => {
                    return (<tbody key={strat.id} style={{border: "none"}}>
                        <tr>
                            <td><FilterIndicator name={strat.area.name} field="areaId" id={strat.areaId} /></td>
                            <td>{strat.room.link && <Link href={fixRoomLink(strat.room.link)}><a className="unfilteredField"><FontAwesomeIcon size="sm" className="mr-1" icon={faGlobeEurope} /></a></Link>}<FilterIndicator name={strat.room.name} field="roomId" id={strat.roomId} /></td>
                            <td><FilterIndicator name={strat.category.name} field="categoryId" id={strat.categoryId} /></td>
                            <td className="stratList"><Link href={`/${strat.id}`}>{strat.name}</Link></td>
                            <td align="center"><DifficultyLabel difficulty={strat.difficulty} /></td>
                            {single || <td><Button variant="outline-dark" size="sm" onClick={() => toggleStrat(strat)}>{isStratVisible(strat) ? "Hide" : "Show"}</Button></td>}
                            {user && user.isLoggedIn && (user.flags.includes("a") || user.username === strat.user.username) && <td style={{border: "none", whiteSpace: "nowrap"}}><Link href={`/strats/edit/${strat.id}`} passHref><a><FontAwesomeIcon size="sm" color="green" icon={faEdit} className="mr-1"/></a></Link><a href="#" onClick={(e) => { showDeleteDialog(strat); e.preventDefault() }}><FontAwesomeIcon size="sm" color="red" icon={faBan} /></a></td>}
                        </tr>
                        {(isStratVisible(strat) || single) &&
                            <tr key={`strat-${strat.id}`}>
                                <td colSpan={5 + (single ? 0 : 1) + (user && user.isLoggedIn ? 1 : 0)} style={{border: "none"}}><Strategy strat={strat} /></td>
                            </tr>
                        }
                    </tbody>)
                })}
        </Table>
        <Modal show={deleteDialogState.show} onHide={closeDeleteDialog}>
            <Modal.Header closeButton>
                <Modal.Title>Delete strategy</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the strategy:<br />
                {deleteDialogState.strat && deleteDialogState.strat.name}
            </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={closeDeleteDialog}>
                    No
                </Button>
                <Button variant="primary" onClick={() => deleteStrat(deleteDialogState.strat)}>
                    Yes, delete it
                </Button>
            </Modal.Footer>
        </Modal>     
    </>
    )
}