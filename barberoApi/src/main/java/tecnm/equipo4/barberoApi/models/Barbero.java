package tecnm.equipo4.barberoApi.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data

@PrimaryKeyJoinColumn(name = "idUsuario")
@Table (name = "barbero")
public class Barbero extends Usuario{
    @Column(nullable = false)
    private int experiencia;

    @Column(nullable = false)
    private String tituloRol;

    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();

    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<DisponibilidadBarbero> disponibilidades = new ArrayList<>();

    //relacion de muchos a 1, muchos clientes pueden tener un barbero
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idBarbero")
    private Barbero barbero;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Turno> turno = new ArrayList<>();

    //relacion de muchos a 1, muchos clientes pueden tener un barbero
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idCliente")
    private Cliente cliente;


}
