import { defineColumn } from '../core'
import { defineSFNTTable } from './SFNT'
import { SFNTTable } from './SFNTTable'

/**
 * @link https://learn.microsoft.com/zh-cn/typography/opentype/spec/gsub
 */
@defineSFNTTable('GSUB', 'gsub')
export class Gsub extends SFNTTable {
  @defineColumn('uint16') declare majorVersion: number
  @defineColumn('uint16') declare minorVersion: number
  @defineColumn('uint16') declare scriptListOffset: number
  @defineColumn('uint16') declare featureListOffset: number
  @defineColumn('uint16') declare lookupListOffset: number
  @defineColumn('uint16') declare featureVariationsOffset: number
  // TODO
}
