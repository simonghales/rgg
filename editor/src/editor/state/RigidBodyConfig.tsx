import React from "react"
import {Number} from "leva/packages/leva/src/index"

const RigidBodyConfig: React.FC = () => {
    return (
        <div>
            <div>
                <label htmlFor="">
                    Type
                </label>
                <select>
                    <option value="">Dynamic</option>
                    <option value="">Static</option>
                    <option value="">Kinematic</option>
                </select>
            </div>
            <div>
                <div>
                    <label htmlFor="">
                        Mass
                    </label>
                    <Number value={0} onChange={() => {}} onUpdate={() => {}} displayValue={0} label={"Todo"} settings={{
                        min: 0,
                        max: 100,
                        step: 1,
                        pad: 0,
                        initialValue: 0,
                    }}/>
                </div>
            </div>
        </div>
    )
}

export default RigidBodyConfig