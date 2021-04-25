import { Strat } from '@prisma/client'
import { Row, Col } from 'react-bootstrap'
import sanitizeHtml from 'sanitize-html'
import { Embed } from './embed'

interface StrategyProps {
    strat: Strat
}

export function Strategy({ strat } : StrategyProps) {
    return (
        <Row className="px-2 pt-2 pb-4">
            <Col>
                <div className="stratDesc" dangerouslySetInnerHTML={{ __html: sanitizeHtml(strat.description.replace(/\n/g, "<br/>"))}}></div>
            </Col>
            <Col>
                {typeof window === 'undefined' || <Embed link={strat.link} width={560} height={315} />}
            </Col>
        </Row>
    )
}