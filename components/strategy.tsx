import { Strat } from '@prisma/client'
import { Media } from 'react-bootstrap'
import sanitizeHtml from 'sanitize-html'
import { Embed } from './embed'

interface StrategyProps {
    strat: Strat
}

export function Strategy({ strat } : StrategyProps) {
    /* Only run this component in the browser due to it using browser-only features right now */
    return (
        <Media className="px-2 pt-2 pb-4">
            <Media.Body>
                <div className="stratDesc" dangerouslySetInnerHTML={{ __html: sanitizeHtml(strat.description.replace(/\n/g, "<br/>"))}}></div>
            </Media.Body>
            <Media className="ml-4">
                <Embed link={strat.link} width={560} height={315} />
            </Media>
        </Media>
    )
}