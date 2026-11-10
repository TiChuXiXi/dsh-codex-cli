/** One icon family for the entire plugin, including the vendored dock adapter. */
import * as React from 'react'
import {
 Activity, Archive, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Ban, Brain,
 Check, CircleCheck, CircleAlert, Info, ChevronDown, ChevronLeft, ChevronRight, Columns2, Command, Copy,
 Download, Ellipsis, ExternalLink, FileCode, FileText, FileImage, FileArchive, FileSpreadsheet, FileAudio, FileVideo, FileType, Folder, FolderOpen,
 FolderPlus, GitBranch, GitFork, Globe, History, ListTree, LoaderCircle,
 Maximize2, Menu, MessageSquare, Minimize2, Moon, PanelLeft, PanelRight,
 Paperclip, Pencil, Plus, RotateCw, Settings2, ShieldCheck, Sparkles, Square,
 Sun, Terminal, Trash2, WrapText, X,
} from 'lucide-react'

const icons = {
 activity:Activity, archive:Archive, arrowDown:ArrowDown, arrowLeft:ArrowLeft,
 arrowRight:ArrowRight, arrowUp:ArrowUp, ban:Ban, brain:Brain, check:Check,
 circleCheck:CircleCheck, circleAlert:CircleAlert, info:Info,
 chevronDown:ChevronDown, chevronLeft:ChevronLeft, chevronRight:ChevronRight,
 columns:Columns2, command:Command, copy:Copy, download:Download, more:Ellipsis,
 external:ExternalLink, fileCode:FileCode, file:FileText, fileImage:FileImage, fileArchive:FileArchive, fileSpreadsheet:FileSpreadsheet, fileAudio:FileAudio, fileVideo:FileVideo, fileType:FileType, folder:Folder,
 folderOpen:FolderOpen, folderPlus:FolderPlus, git:GitBranch, fork:GitFork,
 globe:Globe, history:History, plan:ListTree, loader:LoaderCircle,
 maximize:Maximize2, menu:Menu, message:MessageSquare, minimize:Minimize2,
 moon:Moon, panelLeft:PanelLeft, panelRight:PanelRight, attachment:Paperclip,
 pencil:Pencil, plus:Plus, refresh:RotateCw, settings:Settings2, shield:ShieldCheck,
 model:Sparkles, stop:Square, sun:Sun, terminal:Terminal, trash:Trash2, wrap:WrapText, close:X,
}
export type IconName = keyof typeof icons
export function Icon({name,size=18,...props}: Omit<React.SVGProps<SVGSVGElement>,'name'> & {name:IconName,size?:number}) {
 const Glyph=icons[name]
 return <Glyph size={size} strokeWidth={1.75} absoluteStrokeWidth aria-hidden="true" focusable="false" {...props}/>
}
export function IconButton({icon,label,className='',...props}:React.ButtonHTMLAttributes<HTMLButtonElement>&{icon:IconName,label:string}){
 return <button type="button" className={'dsh-codex-icon-button '+className} aria-label={label} title={label} {...props}><Icon name={icon}/></button>
}
