import styles from '../Card.module.scss';
import { Utils } from '../../../utils/Utils';
import * as React from 'react';
import { CardConstants } from '../../../utils/Constants';

export class CardRenderHelper {

    public static GetCardSubtitle(subtitle: string): JSX.Element {
        if(!Utils.IsNullOrEmpty(subtitle)) {
            return (<div className={styles.subtitle}><span>{subtitle}</span></div> );
        }
        return null;
    }

    public static GetCardImage(imageUrl:string, cardHeightStr:string, useImageAsBackground: boolean) {
        if(!useImageAsBackground) {
            let imageHeight: number = ((parseInt(cardHeightStr)) || 300) * CardConstants.CardTextProportion;
            let imageHeightStyle: React.CSSProperties= {height: imageHeight};
            return (<img src={imageUrl} className={styles.image} style={imageHeightStyle}/>);
        }
        return null;
    }

    public static GetCardImageAsBackgroundStyleClass(useImageAsBackground: boolean):string {
        if(useImageAsBackground) {
            return styles.imageAsBackground;
        }
        return "";
    }

    //HACK: No se pueden poner estilos "dinámicos" (en este caso, un estilo "backgroundImage" con la url de cada banner)
    //      así que se ponen por el atributo "style" según lo que devuelva esta función
    public static GetCardWrapperProgrammaticStyles(imageUrl:string, cardHeightStr:string, 
                                                    useImageAsBackground: boolean): React.CSSProperties {
        let cardHeight: number = (parseInt(cardHeightStr)) || 300;
        if(!useImageAsBackground) {
            return {height: cardHeight};
        }
        return {backgroundImage:"url("+imageUrl+")", height: cardHeight};
    }
}