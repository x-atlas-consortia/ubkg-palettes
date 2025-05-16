import axios from "axios";
import {scaleOrdinal} from 'd3'

async function getData(context, token) {

    const ubkgBase = 'https://ontology.api.hubmapconsortium.org/'
    const groupsUriBase = {
        sennet: 'https://ingest.api.sennetconsortium.org/metadata/data-provider-groups',
        hubmap: 'https://ingest.api.hubmapconsortium.org/metadata/data-provider-groups'
    }

    const requestOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    const loadGroups = async (Palette) => {
        const color = scaleOrdinal(Palette.blueGreyColors)
        let results = await axios.get(
            groupsUriBase[context],
            requestOptions
        )
        let colors = {}
        let groupName
        for (let o of results.data.groups) {
            groupName = o.displayname?.trim()
            colors[groupName] = color(groupName)
        }
        return colors
    }

    const loadOrgans = async (Palette) => {
        const color = scaleOrdinal(Palette.pinkColors)
        let results = await axios.get(
            `${ubkgBase}organs?application_context=${context}`,
            requestOptions
        )
        let colors = {}
        let groupName
        for (let o of results.data) {
            groupName = o.category?.term?.trim() || o.term?.trim()
            colors[groupName] = color(groupName)
        }
        return colors
    }

    const loadDatasetTypes = async (Palette) => {
        const color = scaleOrdinal(Palette.greenColors)
        let result = await axios.get(
            `${ubkgBase}assayclasses?application_context=${context}`,
            requestOptions
        )
        let colors = {}
        let groupName, groupName2
        for (let o of result.data) {
            groupName = o.value?.dataset_type?.trim()
            groupName2 = o.value?.description?.trim()
            colors[groupName] = color(groupName)
            colors[groupName2] = color(groupName2)
        }
        return colors
    }

    const xac = await import('xac-sankey');

    const p1 = loadOrgans(xac.Palette)
    const p2 = loadDatasetTypes(xac.Palette)
    const p3 = loadGroups(xac.Palette)

    const v = await Promise.all([p1, p2, p3]);
    return {organs: v[0], datasetTypes: v[1], groups: v[2]}
    
}



export default getData
