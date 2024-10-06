import { defineColumn, Readable } from '../utils'

export interface VarSelectorRecord {
  varSelector: number
  defaultUVSOffset: number
  unicodeValueRanges: Array<UnicodeValueRange>
  nonDefaultUVSOffset: number
  uVSMappings: Array<VSMappings>
}

export interface UnicodeValueRange {
  startUnicodeValue: number
  additionalCount: number
}

export interface VSMappings {
  unicodeValue: number
  glyphID: number
}

export class CmapSubtableFormat14 extends Readable {
  @defineColumn({ type: 'uint16' }) declare format: 14
  @defineColumn({ type: 'uint32' }) declare length: number
  @defineColumn({ type: 'uint32' }) declare numVarSelectorRecords: number

  get varSelectorRecords(): VarSelectorRecord[] {
    const numVarSelectorRecords = this.numVarSelectorRecords
    this.view.seek(10)
    return Array.from({ length: numVarSelectorRecords }, () => {
      const varSelectorRecord: VarSelectorRecord = {
        varSelector: this.view.readUint24(),
        defaultUVSOffset: this.view.readUint32(),
        unicodeValueRanges: [],
        nonDefaultUVSOffset: this.view.readUint32(),
        uVSMappings: [],
      }
      if (varSelectorRecord.defaultUVSOffset) {
        this.view.seek(varSelectorRecord.defaultUVSOffset)
        const numUnicodeValueRanges = this.view.readUint32()
        varSelectorRecord.unicodeValueRanges = Array.from({ length: numUnicodeValueRanges }, () => {
          return {
            startUnicodeValue: this.view.readUint24(),
            additionalCount: this.view.readUint8(),
          }
        })
      }
      if (varSelectorRecord.nonDefaultUVSOffset) {
        this.view.seek(varSelectorRecord.nonDefaultUVSOffset)
        const numUVSMappings = this.view.readUint32()
        varSelectorRecord.uVSMappings = Array.from({ length: numUVSMappings }, () => {
          return {
            unicodeValue: this.view.readUint24(),
            glyphID: this.view.readUint16(),
          }
        })
      }
      return varSelectorRecord
    })
  }

  getUnicodeGlyphIndexMap(): Map<number, number> {
    const unicodeGlyphIndexMap = new Map<number, number>()
    const varSelectorRecords = this.varSelectorRecords
    for (let i = 0, l = varSelectorRecords.length; i < l; i++) {
      const { uVSMappings } = varSelectorRecords[i]
      uVSMappings.forEach((uVSMapping) => {
        unicodeGlyphIndexMap.set(uVSMapping.unicodeValue, uVSMapping.glyphID)
      })
    }
    return unicodeGlyphIndexMap
  }
}