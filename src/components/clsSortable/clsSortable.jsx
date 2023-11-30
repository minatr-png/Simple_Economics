import './clsSortable.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RiDeleteBin7Line } from 'react-icons/ri';

export function CLSSortable({category, deleteFunction}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({id: category.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div className='sortable' ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div>{category.data.descrip}</div>
      <div className='deleteSort' onClickCapture={deleteFunction}><RiDeleteBin7Line></RiDeleteBin7Line></div>
    </div>
  );
}