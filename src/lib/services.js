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

    const loadDatasetTypes = async (Palette, uri='dataset-types') => {
        const color = scaleOrdinal(Palette.greenColors)
        let result = await axios.get(
            `${ubkgBase}${uri}?application_context=${context}`,
            requestOptions
        )
        let colors = {}
        let groupName, groupName2
        for (let o of result.data) {
            if (uri == 'dataset-types') {
                groupName = o.dataset_type?.trim()
            } else {
                groupName = o.value?.dataset_type?.trim()
                groupName2 = o.value?.description?.trim()
                colors[groupName2] = color(groupName2)
            }
            
            colors[groupName] = color(groupName)
            
        }
        return colors
    }

    const xac = await import('xac-sankey');

    const p1 = loadOrgans(xac.Palette)
    const p2 = loadDatasetTypes(xac.Palette)
    const p2b = loadDatasetTypes(xac.Palette, 'assayclasses')
    const p3 = loadGroups(xac.Palette)

    const v = await Promise.all([p1, p2, p2b, p3]);
    return {organs: v[0], datasetTypes: {...v[1], ...v[2]}, groups: v[3]}
    
}



export default getData
