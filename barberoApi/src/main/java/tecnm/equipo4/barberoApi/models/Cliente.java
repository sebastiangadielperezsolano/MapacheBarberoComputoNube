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
@Table(name = "cliente")
public class Cliente extends Usuario{

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();

    //relacion con barbero

    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<Cliente> clientes = new ArrayList<>();

    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();

    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<DisponibilidadBarbero> disponibilidades = new ArrayList<>();
}
