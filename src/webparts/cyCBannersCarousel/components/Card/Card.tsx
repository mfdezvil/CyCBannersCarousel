import * as React from 'react';
import { ICardProps } from './ICardProps';
import styles from './Card.module.scss';
import {CardRenderHelper} from './helpers/CardRenderHelper';


export class Card extends React.Component<ICardProps, {}> {
    public render(): React.ReactElement<ICardProps> {

        let subtitleContainer: JSX.Element= CardRenderHelper.GetCardSubtitle(this.props.banner.Subtitle);

        let imageContainer: JSX.Element = CardRenderHelper.GetCardImage(this.props.banner.Image.Url, this.props.height, 
                                                                this.props.imageAsBackground);

        let cardWrapperStyles:string = CardRenderHelper.GetCardImageAsBackgroundStyleClass(this.props.imageAsBackground);
        
        let cardProgrammaticStyles: React.CSSProperties = CardRenderHelper.GetCardWrapperProgrammaticStyles(this.props.banner.Image.Url, 
            this.props.height, this.props.imageAsBackground);
       
        return(
            <div className={styles.card}>
                <div className={`${styles.wrapper} ${cardWrapperStyles}`} style={cardProgrammaticStyles}>
                    {imageContainer}
                    <div className={styles.textWrapper}>
                        <a href={this.props.banner.URL} className={styles.url} target="_blank">
                            <div className={styles.title}>
                                <span>{this.props.banner.Title}</span>
                            </div>
                            {subtitleContainer}
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}