import {useComponentsStore} from "./components/components";
import {ComponentState} from "./types";
import {useStateStore} from "./main/store";

export const useHasDeactivatedComponents = () => {
    return useStateStore(state => Object.keys(state.deactivatedComponents).length > 0)
}

export const useDeactivatedComponents = () => {

    const deactivatedComponentsKeys = Object.keys(useStateStore(state => state.deactivatedComponents))
    const deactivatedComponents = useComponentsStore(state => {
        const components: ComponentState[] = []
        deactivatedComponentsKeys.forEach((uid) => {
            components.push(state.deactivatedComponents[uid])
        })
        return components
    })

    return deactivatedComponents.filter((component) => !!component)

}