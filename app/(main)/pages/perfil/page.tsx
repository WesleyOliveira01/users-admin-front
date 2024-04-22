'use client';
import { PerfilService } from '@/service/PerfilService';
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
    const perfilService = new PerfilService();
    let emptyPerfil: Projeto.Perfil = {
        id: 0,
        descricao: '',
    };

    const [perfils, setPerfils] = useState<Projeto.Perfil[] | null>(null);
    const [perfilDialog, setPerfilDialog] = useState(false);
    const [deletePerfilDialog, setDeletePerfilDialog] = useState(false);
    const [deletePerfilsDialog, setDeletePerfilsDialog] = useState(false);
    const [perfil, setPerfil] = useState<Projeto.Perfil>(emptyPerfil);
    const [selectedPerfils, setSelectedPerfils] = useState<Projeto.Perfil[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        if (!perfils) {
            perfilService
                .ListAll()
                .then((res) => setPerfils(res.data))
                .catch((e) => toast.current?.show({ severity: 'error', summary: 'Error Message', detail: e.message }));
        }
    }, [perfils, perfilService]);

    const openNew = () => {
        setPerfil(emptyPerfil);
        setSubmitted(false);
        setPerfilDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilDialog(false);
    };

    const hideDeletePerfilDialog = () => {
        setDeletePerfilDialog(false);
    };

    const hideDeletePerfilsDialog = () => {
        setDeletePerfilsDialog(false);
    };

    const savePerfil = () => {
        setSubmitted(true);
        if (!perfil.id) {
            perfilService
                .Create(perfil)
                .then(() => {
                    setPerfilDialog(false);
                    setPerfil(emptyPerfil);
                    setPerfils(null);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Perfil cadastrado com sucesso',
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
            perfilService
                .Update(perfil)
                .then((res) => {
                    setPerfilDialog(false);
                    setPerfil(emptyPerfil);
                    setPerfils(null);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Perfil atualizado com sucesso',
                        life: 3000
                    });
                })
                .catch((e) =>{
                    console.log(e.message)
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: e.message,
                        life: 3000
                    })}
                );
        }
    };

    const editPerfil = (perfil: Projeto.Perfil) => {
        setPerfil({ ...perfil });
        setPerfilDialog(true);
    };

    const confirmDeletePerfil = (perfil: Projeto.Perfil) => {
        setPerfil(perfil);
        setDeletePerfilDialog(true);
    };

    const deletePerfil = () => {
        let _perfils = (perfils as any)?.filter((val: any) => val.id !== perfil.id);
        setPerfils(_perfils);
        setDeletePerfilDialog(false);

        perfilService
            .Delete(perfil.id)
            .then((res) => {
                setPerfil(emptyPerfil);
                setPerfils(null);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Recurso deletado com sucesso',
                    life: 3000
                });
            })
            .catch((e) => {
                console.log(e.message)
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
        setDeletePerfilsDialog(true);
    };

    const deleteSelectedUsers = () => {
        let _perfils = (perfils as any)?.filter((val: any) => !(selectedPerfils as any)?.includes(val));
        setPerfils(_perfils);
        selectedPerfils.forEach((user: Projeto.Perfil) => {
            perfilService
                .Delete(user.id)
                .then(() => setPerfils(null))
                .catch((e) => {
                    console.log(e);
                    setPerfils(null);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: e.message,
                        life: 3000
                    });
                });
        });
        setDeletePerfilsDialog(false);
        setSelectedPerfils([]);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'perfils deletados com sucesso',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _perfil = { ...perfil };
        _perfil[`${name}`] = val;

        setPerfil(_perfil);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPerfils || !(selectedPerfils as any).length} />
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

    const loginBodyTemplate = (rowData: Projeto.Perfil) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const descricaoBodyTemplate = (rowData: Projeto.Perfil) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.descricao}
            </>
        );
    };


    const actionBodyTemplate = (rowData: Projeto.Perfil) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfil(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfil(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage perfils</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={savePerfil} />
        </>
    );
    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePerfilDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deletePerfil} />
        </>
    );
    const deleteUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePerfilDialog} />
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
                        value={perfils}
                        selection={selectedPerfils}
                        onSelectionChange={(e) => setSelectedPerfils(e.value as any)}
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
                        <Column field="Descricao" header="Descricao" sortable body={descricaoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>


                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={perfilDialog} style={{ width: '450px' }} header="Recurso Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Descrição</label>
                            <InputText
                                id="descricao"
                                value={perfil.descricao}
                                onChange={(e) => onInputChange(e, 'descricao')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !perfil.descricao
                                })}
                            />
                            {submitted && !perfil.descricao && <small className="p-invalid">Perfil is required.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deletePerfilDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeletePerfilDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfil && (
                                <span>
                                    Você realmente deseja deletar o recurso <b>{perfil.descricao}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeletePerfilsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfil && <span>Você realmente deseja deletar os perfils selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Recurso;
