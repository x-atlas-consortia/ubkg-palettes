import {useEffect, useState} from 'react'
import axios from "axios";

function useContent(sab) {

    const [ubkg, setUbkg] = useState({})

    const loadUbkg = async () => {
        let organTypes = await axios.get(
            `https://ontology.api.hubmapconsortium.org/organs?application_context=${sab}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        let organsDict = {}
        for (let o of organTypes.data) {
            organsDict[o.term.trim().toLowerCase()] = o.category?.term?.trim() || o.term?.trim()
        }
        window.UBKG = {organTypes: organTypes.data, organTypesGroups: organsDict}
        return window.UBKG
    }

    useEffect(() => {
        loadUbkg().then((r) => setUbkg(r))
    }, [])

    return {ubkg}
}



export default useContent
