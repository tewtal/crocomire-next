import { Strat } from '@prisma/client'
import { Media } from 'react-bootstrap'
import sanitizeHtml from 'sanitize-html'
import { Embed } from './embed'

interface StrategyProps {
    strat: Strat
}

export function Strategy({ strat } : StrategyProps) {
    return (
        <Media className="px-2 pt-2 pb-4">
            <Media.Body>
                <div className="stratDesc" dangerouslySetInnerHTML={{ __html: sanitizeHtml(strat.description.replace(/\n/g, "<br/>"))}}></div>
            </Media.Body>
            <Media className="ml-4">
                {typeof window === 'undefined' || <Embed link={strat.link} width={560} height={315} />}
            </Media>
        </Media>
    )
}