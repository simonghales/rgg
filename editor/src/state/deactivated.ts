import {useComponentsStateStore} from "./components/componentsState";
import {useComponentsStore} from "./components/components";
import {ComponentState} from "./types";

export const useHasDeactivatedComponents = () => {
    return useComponentsStateStore(state => Object.keys(state.deactivatedComponents).length > 0)
}

export const useDeactivatedComponents = () => {

    const deactivatedComponentsKeys = Object.keys(useComponentsStateStore(state => state.deactivatedComponents))
    const deactivatedComponents = useComponentsStore(state => {
        const components: ComponentState[] = []
        deactivatedComponentsKeys.forEach((uid) => {
            components.push(state.deactivatedComponents[uid])
        })
        return components
    })

    return deactivatedComponents.filter((component) => !!component)

}