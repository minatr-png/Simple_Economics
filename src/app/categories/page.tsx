"use client";
import PocketBase from 'pocketbase';
import general_styles from  '../styles.module.css';
import styles from  './styles.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddRecordLayout, NavButtonsLayout } from '@clsLayouts';
import onEnterPress from '@clsInputs';
import { useEffect, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CLSSortable } from '@clsSortable';

export default function Page() {

    const db = new PocketBase('http://127.0.0.1:8090');

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        db.collection('categories').getFullList({ fields: 'order, descrip, id' }).then((res) => {
            let loaded_categories = res.map(category => ({ data: { id: category.id, descrip: category.descrip }, id: category.order}));
            setCategories(loaded_categories);
        });
    }, []);

    const submitCategory = () => {
        let category = (document.getElementById('descripInput') as HTMLSelectElement).value;
 
        if (category) {
            const data = {
                "descrip": category,
                "order": categories.length
            };

            db.collection('Categories').create(data).then( rec => {
                toast.success('Categoría añadida', {
                    position: 'bottom-right',
                    autoClose: 1700
                });
                
                document.querySelector("input").value = "";
                setCategories([...categories, {data: {id: rec.id,  descrip: rec.descrip}, id: rec.order}]);
            });
        } else {
            toast.error('Faltan campos por rellenar', {
                position: 'bottom-right',
                autoClose: 1700
            });
        }
    }

    function handleDragEnd(event) {
        const {active, over} = event;
        
        if (over && active.id !== over.id) {
            setCategories(items => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    function deleteCategory(id, ev) {
        debugger;
        db.collection('Categories').delete(id).then(() => {
            ev.target.closest('[role="button"]').remove();
            toast.success('Categoría eliminada', {
                position: 'bottom-right',
                autoClose: 1700
            });
        });
    }

    return (
        <div id="moduleContainer" className={general_styles.economics + " bg-economics"}>
            <AddRecordLayout params={{btnTitle: "Añadir Categoría", btnFunction: submitCategory}} >
                <div>
                    <span>Categoría: </span>
                    <input id="descripInput" type="text" placeholder="Otros" required tabIndex={0} onKeyUp={(ev) => onEnterPress(ev, 99)}></input>
                </div>
            </AddRecordLayout>
            <NavButtonsLayout>
                <div className={styles.table}>
                    <div className={styles.header}>Categorías</div>
                    <div className={styles.body}>
                    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
                        <SortableContext items={categories} strategy={verticalListSortingStrategy}>
                            { categories.map(category => <CLSSortable category={category} deleteFunction={ev => deleteCategory(category.data.id, ev)} key={category.id} />) }
                        </SortableContext>
                    </DndContext>
                    </div>
                </div>
                <ToastContainer/>
            </NavButtonsLayout>
        </div>
    );
}