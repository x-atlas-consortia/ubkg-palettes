import {useEffect, useState} from 'react'
import axios from "axios";
import {scaleOrdinal} from 'd3'

function useContent(sab) {

    const [ubkg, setUbkg] = useState({})

    const loadUbkg = async (Palette) => {
        const color = scaleOrdinal(Palette.pinkColors)
        let organTypes = await axios.get(
            `https://ontology.api.hubmapconsortium.org/organs?application_context=${sab}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        let organPalette = {}
        let groupName
        for (let o of organTypes.data) {
            groupName = o.category?.term?.trim() || o.term?.trim()
            organPalette[groupName] = color(groupName)
        }
        return {organs: organPalette }
    }

    useEffect(() => {
        import('xac-sankey').then((xac)=>{
            loadUbkg(xac.Palette).then((r) => setUbkg(r))
        })
    }, [])

    return {ubkg}
}



export default useContent
