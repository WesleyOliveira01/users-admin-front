'use client';
import { RecursoService } from '@/service/RecursoService';
import { Projeto } from '@/types';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

const Recurso = () => {
    const recursoService = new RecursoService();
    let emptyRecurso: Projeto.Recurso = {
        id: 0,
        name: '',
        key: ''
    };

    const [recursos, setRecursos] = useState<Projeto.Recurso[]>([]);
    const [recursoDialog, setRecursoDialog] = useState(false);
    const [deleteRecursoDialog, setDeleteRecursoDialog] = useState(false);
    const [deleteRecursosDialog, setDeleteRecursosDialog] = useState(false);
    const [recurso, setRecurso] = useState<Projeto.Recurso>(emptyRecurso);
    const [selectedRecursos, setSelectedRecursos] = useState<Projeto.Recurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        if (recursos?.length == 0) {
            recursoService
                .ListAll()
                .then((res) => setRecursos(res.data))
                .catch((e) => toast.current?.show({ severity: 'error', summary: 'Error Message', detail: e.message }));
        }
    }, [recursos, recursoService]);

    const openNew = () => {
        setRecurso(emptyRecurso);
        setSubmitted(false);
        setRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRecursoDialog(false);
    };

    const hideDeleteRecursoDialog = () => {
        setDeleteRecursoDialog(false);
    };

    const hideDeleteRecursosDialog = () => {
        setDeleteRecursosDialog(false);
    };

    const saveRecurso = () => {
        setSubmitted(true);
        if (!recurso.id) {
            recursoService
                .Create(recurso)
                .then(() => {
                    setRecursoDialog(false);
                    setRecurso(emptyRecurso);
                    setRecursos([]);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'recurso cadastrado com sucesso',
                        life: 3000
                    });
                })
                .catch((e) =>
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: e.message,
                        life: 3000
                    })
                );
        } else {
            recursoService
                .Update(recurso)
                .then((res) => {
                    setRecursoDialog(false);
                    setRecurso(emptyRecurso);
                    setRecursos([]);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Recurso atualizado com sucesso',
                        life: 3000
                    });
                })
                .catch((e) =>
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: e.message,
                        life: 3000
                    })
                );
        }
    };

    const editRecurso = (recurso: Projeto.Recurso) => {
        setRecurso({ ...recurso });
        setRecursoDialog(true);
    };

    const confirmDeleteRecurso = (recurso: Projeto.Usuario) => {
        setRecurso(recurso);
        setDeleteRecursoDialog(true);
    };

    const deleteRecurso = () => {
        let _recursos = (recursos as any)?.filter((val: any) => val.id !== recurso.id);
        setRecursos(_recursos);
        setDeleteRecursoDialog(false);

        recursoService
            .Delete(recurso.id)
            .then((res) => {
                setRecurso(emptyRecurso);
                setRecursos([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Recurso deletado com sucesso',
                    life: 3000
                });
            })
            .catch((e) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: e.message,
                    life: 3000
                });
            });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteRecursosDialog(true);
    };

    const deleteSelectedUsers = () => {
        let _recursos = (recursos as any)?.filter((val: any) => !(selectedRecursos as any)?.includes(val));
        setRecursos(_recursos);
        selectedRecursos.forEach((user: Projeto.Recurso) => {
            recursoService
                .Delete(user.id)
                .then(() => setRecursos([]))
                .catch((e) => {
                    console.log(e);
                    setRecursos([]);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: e.message,
                        life: 3000
                    });
                });
        });
        setDeleteRecursosDialog(false);
        setSelectedRecursos([]);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Recursos deletados com sucesso',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _recurso = { ...recurso };
        _recurso[`${name}`] = val;

        setRecurso(_recurso);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRecursos || !(selectedRecursos as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const loginBodyTemplate = (rowData: Projeto.Recurso) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Projeto.Recurso) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const keyBodyTemplate = (rowData: Projeto.Recurso) => {
        return (
            <>
                <span className="p-column-title">Key</span>
                {rowData.key}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.Recurso) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editRecurso(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteRecurso(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Recursos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveRecurso} />
        </>
    );
    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteRecursoDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteRecurso} />
        </>
    );
    const deleteUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteRecursoDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedUsers} />
        </>
    );

    return (
        <div className="grid Recurso-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={recursos}
                        selection={selectedRecursos}
                        onSelectionChange={(e) => setSelectedRecursos(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        globalFilter={globalFilter}
                        emptyMessage="No users found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="id" sortable body={loginBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="key" header="key" sortable body={keyBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={recursoDialog} style={{ width: '450px' }} header="Recurso Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={recurso.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !recurso.name
                                })}
                            />
                            {submitted && !recurso.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="login">Key</label>
                            <InputText
                                id="key"
                                value={recurso.key}
                                onChange={(e) => onInputChange(e, 'key')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !recurso.key
                                })}
                            />
                            {submitted && !recurso.key && <small className="p-invalid">Key is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRecursoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {recurso && (
                                <span>
                                    Você realmente deseja deletar o recurso <b>{recurso.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRecursosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteRecursosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {recurso && <span>Você realmente deseja deletar os recursos selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Recurso;
