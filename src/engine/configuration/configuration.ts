import {ConfigurationItemEnum} from "./configuration.enum";

export const Configuration = (() => {
    
    const defaultConfiguration: Record<ConfigurationItemEnum, any> = {
        [ConfigurationItemEnum.SCALE]: 3,
        [ConfigurationItemEnum.SHOW_GAME_INFO]: true
    }
    
    const getItem = (configurationItemEnum: ConfigurationItemEnum) => {
        const data = localStorage.getItem(ConfigurationItemEnum[configurationItemEnum]);
        const defaultData = defaultConfiguration[configurationItemEnum];
        
        if(data === null) return defaultData;
        
        switch (typeof defaultData) {
            case "number":
                return  parseInt(data);
            case "boolean":
                return data === 'true';
            case "object":
                return JSON.parse(data);
                
            default:
                return data;
        }
    }
    
    const setItem = (configurationItemEnum: ConfigurationItemEnum, value: any) =>
        localStorage.setItem(ConfigurationItemEnum[configurationItemEnum], value);
    
    return {
        getItem,
        setItem
    }
})();